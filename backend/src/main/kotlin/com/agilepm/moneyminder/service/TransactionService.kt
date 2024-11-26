package com.agilepm.moneyminder.service

import com.agilepm.moneyminder.entity.Rule
import com.agilepm.moneyminder.entity.Transaction
import com.agilepm.moneyminder.entity.TransactionType
import com.agilepm.moneyminder.entity.applyRule
import com.agilepm.moneyminder.entity.mapToResponse
import com.agilepm.moneyminder.model.request.CreateTransactionRequest
import com.agilepm.moneyminder.model.request.TransactionSearchRequest
import com.agilepm.moneyminder.model.request.UpdateTransactionRequest
import com.agilepm.moneyminder.model.response.PageResponse
import com.agilepm.moneyminder.model.response.TopExpenseResponse
import com.agilepm.moneyminder.model.response.TransactionResponse
import com.agilepm.moneyminder.repository.CategoryRepository
import com.agilepm.moneyminder.repository.RuleRepository
import com.agilepm.moneyminder.repository.TransactionRepository
import com.agilepm.moneyminder.repository.specification.TransactionRuleSpecification
import com.agilepm.moneyminder.repository.specification.TransactionSearchSpecification
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TransactionService(
    private val transactionRepository: TransactionRepository,
    private val categoryRepository: CategoryRepository,
    private val accountService: AccountService,
    private val ruleRepository: RuleRepository,
    private val exchangeService: ExchangeService
) {

    @Transactional(readOnly = true)
    fun searchTransactions(spaceId: UUID, searchRequest: TransactionSearchRequest): PageResponse<TransactionResponse> {
        val specification = TransactionSearchSpecification(
            searchRequest.name,
            searchRequest.notes,
            searchRequest.accountId,
            searchRequest.categoryId,
            searchRequest.needReview,
            searchRequest.dateFrom,
            searchRequest.dateTo,
            spaceId
        )

        val pageable = PageRequest.of(
            searchRequest.page ?: 0,
            searchRequest.size ?: 5,
            Sort.by("createdDate").descending()
        )

        val transactionPage = transactionRepository.findAll(specification, pageable)

        val content = transactionPage
            .map { transaction ->
                transaction.mapToResponse()
            }.toList()

        return PageResponse(
            content,
            transactionPage.number,
            transactionPage.size,
            transactionPage.totalElements,
            transactionPage.totalPages,
            transactionPage.isLast
        )
    }

    @Transactional
    fun createTransaction(currentUserSpaceId: UUID, request: CreateTransactionRequest): TransactionResponse {
        val account = accountService.getAccountById(request.accountId)
        val fromAccount = request.fromAccountId?.let { accountService.getAccountById(it) }
        val toAccount = request.toAccountId?.let { accountService.getAccountById(it) }
        val rules = ruleRepository.findAllBySpaceIdOrderByConditionTextToApplyAsc(currentUserSpaceId)

        account.monoBankId?.let {
            throw IllegalArgumentException("Account is linked to Monobank, manual transaction is not allowed")
        }

        val category = request.categoryId?.let {
            categoryRepository.findById(it).orElseThrow { IllegalArgumentException("Category not found") }
        }

        var currencyRate: BigDecimal? = null
        if (account.space.primaryCurrency.code != request.currency.code) {
            val exchangeRate = exchangeService.fetchExchangeRates().find { rate ->
                (rate.currencyCodeA == request.currency.code && rate.currencyCodeB == account.space.primaryCurrency.code)
                        || (rate.currencyCodeA == account.space.primaryCurrency.code && rate.currencyCodeB == request.currency.code)
            } ?: throw RuntimeException("Exchange rate not found")
            currencyRate = BigDecimal.valueOf(exchangeRate.rateBuy)
        }

        val transaction = Transaction(
            id = null,
            name = request.name,
            notes = if (request.notes.isNullOrBlank()) null else request.notes,
            amount = request.amount,
            currency = request.currency,
            date = request.date,
            monoBankId = null,
            account = account,
            fromAccount = if (fromAccount == null) null else account,
            toAccount = toAccount,
            category = category,
            type = request.type,
            createdDate = LocalDateTime.now(),
            currencyRate = currencyRate
        )

        rules.stream().forEach { rule -> transaction.applyRule(rule) }

        val savedTransaction = transactionRepository.save(transaction)

        if (request.type == TransactionType.INCOME) {
            accountService.increaseAccountBalanceByAmount(account, request.amount)
        } else if (request.type == TransactionType.EXPENSE) {
            accountService.decreaseAccountBalanceByAmount(account, request.amount)
        } else if (request.type == TransactionType.TRANSFER && toAccount != null) {
            accountService.decreaseAccountBalanceByAmount(fromAccount!!, request.amount)
            accountService.increaseAccountBalanceByAmount(toAccount, request.amount)
        }

        return savedTransaction.mapToResponse()
    }

    @Transactional
    fun updateTransaction(id: UUID, request: UpdateTransactionRequest): TransactionResponse {
        val transaction = getTransactionById(id)
        transaction.name = request.name
        transaction.notes = request.notes
        transaction.date = request.date

        request.categoryId?.let {
            if (request.categoryId != transaction.category?.id) {
                transaction.category =
                    categoryRepository.findById(it).orElseThrow { IllegalArgumentException("Category not found") }
            }
        }

        request.toAccountId?.let {
            if (request.toAccountId != transaction.toAccount?.id) {
                transaction.toAccount = accountService.getAccountById(it)
            }
        }

        if (request.type != transaction.type) {
            transaction.type = request.type
            if (request.type == TransactionType.TRANSFER) {
                request.fromAccountId?.let {
                    if (request.fromAccountId != transaction.fromAccount?.id) {
                        transaction.fromAccount = accountService.getAccountById(it)
                    }
                }
                request.toAccountId?.let {
                    if (request.toAccountId != transaction.toAccount?.id) {
                        transaction.toAccount = accountService.getAccountById(it)
                    }
                }
                transaction.category = null
            } else {
                transaction.toAccount = null
                transaction.fromAccount = null
            }
        }

        request.amount?.let {
            if (transaction.monoBankId == null && request.amount != transaction.amount) {
                val previousAmount = transaction.amount
                transaction.amount = it
                if (transaction.type == TransactionType.INCOME) {
                    accountService.updateAccountBalance(transaction.account, previousAmount, it)
                } else if (transaction.type == TransactionType.EXPENSE) {
                    accountService.updateAccountBalance(
                        transaction.account,
                        previousAmount.multiply(BigDecimal.valueOf(-1)),
                        it.multiply(BigDecimal.valueOf(-1))
                    )
                } else if (transaction.type == TransactionType.TRANSFER && request.toAccountId != null) {
                    accountService.updateAccountBalance(
                        transaction.fromAccount!!,
                        previousAmount.multiply(BigDecimal.valueOf(-1)),
                        it.multiply(BigDecimal.valueOf(-1))
                    )
                    accountService.updateAccountBalance(transaction.toAccount!!, previousAmount, it)
                }
            }
        }

        return transactionRepository.save(transaction).mapToResponse()
    }

    @Transactional
    fun deleteTransaction(id: UUID) {
        val transaction = getTransactionById(id)

        transaction.monoBankId?.let {
            throw IllegalArgumentException("Bank transaction cannot be deleted")
        }

        transactionRepository.delete(transaction)

        if (transaction.type == TransactionType.INCOME) {
            accountService.decreaseAccountBalanceByAmount(transaction.account, transaction.amount)
        } else if (transaction.type == TransactionType.EXPENSE) {
            accountService.increaseAccountBalanceByAmount(transaction.account, transaction.amount)
        } else if (transaction.type == TransactionType.TRANSFER && transaction.toAccount != null) {
            accountService.increaseAccountBalanceByAmount(transaction.fromAccount!!, transaction.amount)
            accountService.decreaseAccountBalanceByAmount(transaction.toAccount!!, transaction.amount)
        }
    }

    private fun getTransactionById(id: UUID): Transaction {
        return transactionRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Transaction not found") }
    }

    @Transactional
    fun applyRuleToExistingTransactions(spaceId: UUID, rule: Rule) {
        val ruleSpecification = TransactionRuleSpecification(rule, spaceId)
        val transactions = transactionRepository.findAll(ruleSpecification)

        transactions.map { t -> t.applyRule(rule) }

        transactionRepository.saveAll(transactions)
    }

}
