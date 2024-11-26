package com.agilepm.moneyminder.service

import com.agilepm.moneyminder.entity.Account
import com.agilepm.moneyminder.entity.AccountType
import com.agilepm.moneyminder.entity.Currency
import com.agilepm.moneyminder.entity.Space
import com.agilepm.moneyminder.entity.Transaction
import com.agilepm.moneyminder.entity.TransactionType
import com.agilepm.moneyminder.entity.mapToResponse
import com.agilepm.moneyminder.exceptions.ResourceNotFoundException
import com.agilepm.moneyminder.model.request.AccountRequest
import com.agilepm.moneyminder.model.response.AccountResponse
import com.agilepm.moneyminder.model.response.MonoBankExchangeRateResponse
import com.agilepm.moneyminder.model.response.NetWorthResponse
import com.agilepm.moneyminder.model.response.TypeGroupedAccounts
import com.agilepm.moneyminder.repository.AccountRepository
import com.agilepm.moneyminder.repository.SpaceRepository
import com.agilepm.moneyminder.repository.TransactionRepository
import com.agilepm.moneyminder.repository.projection.AccountMonoBankTokenProjection
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*
import java.util.stream.Collectors
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AccountService(
    private val accountRepository: AccountRepository,
    private val spaceRepository: SpaceRepository,
    private val transactionRepository: TransactionRepository,
    private val exchangeService: ExchangeService,
    private val accountBalanceHistoryService: AccountBalanceHistoryService
) {

    @Transactional(readOnly = true)
    fun getAccountById(id: UUID): Account {
        return accountRepository.findById(id).orElseThrow { IllegalArgumentException("Account not found") }
    }

    @Transactional(readOnly = true)
    fun getAccountResponseById(spaceId: UUID, id: UUID): AccountResponse {
        return accountRepository.findById(id).map { it.mapToResponse() }
            .orElseThrow { IllegalArgumentException("Account not found") }
    }

    @Transactional
    fun saveAccount(account: Account): Account {
        return accountRepository.save(account);
    }

    @Transactional(readOnly = true)
    fun existsBySpaceIdAndMonoBankId(spaceId: UUID, monoBankId: String): Boolean {
        return accountRepository.existsBySpaceIdAndMonoBankId(spaceId, monoBankId);
    }

    @Transactional(readOnly = true)
    fun getMonobankAccountIds(spaceId: UUID): List<String> {
        return accountRepository.findAllMonoBankIdsBySpaceId(spaceId);
    }

    @Transactional(readOnly = true)
    fun getAllMonobankAccountsForSpace(spaceId: UUID): List<AccountMonoBankTokenProjection> {
        return accountRepository.findAllBySpaceIdAndMonoBankIdIsNotNull(spaceId);
    }

    @Transactional(readOnly = true)
    fun getAllMonobankAccountsAvailableForTransactionSync(): List<AccountMonoBankTokenProjection> {
        return accountRepository.findAllByMonoBankIdIsNotNull(LocalDateTime.now().minusMinutes(5));
    }

    @Transactional(readOnly = true)
    fun getAllAccounts(spaceId: UUID, skipBankAccounts: Boolean): List<AccountResponse> {
        val accounts =
            if (skipBankAccounts) accountRepository.findAllBySpaceIdAndMonoBankIdIsNullOrderByCreatedDate(spaceId)
            else accountRepository.findAllBySpaceIdOrderByCreatedDate(spaceId)
        return accounts
            .stream()
            .map { account ->
                account.mapToResponse()
            }
            .collect(Collectors.toList())
    }

    @Transactional
    fun updateAccountBalanceFromMonoBank(account: Account, balance: Int) {
        account.balance = balance.toBigDecimal().divide(BigDecimal.valueOf(100))
        accountRepository.save(account)
        accountBalanceHistoryService.saveHistory(account)
    }

    @Transactional
    fun updateAccountTransactionSyncDate(account: Account) {
        account.transactionsSyncDate = LocalDateTime.now()
        accountRepository.save(account)
    }

    @Transactional
    fun updateAccountBalance(account: Account, previousAmount: BigDecimal, newAmount: BigDecimal) {
        account.balance = account.balance.minus(previousAmount).add(newAmount);
        accountRepository.save(account)
        accountBalanceHistoryService.saveHistory(account)
    }

    @Transactional
    fun increaseAccountBalanceByAmount(account: Account, amount: BigDecimal) {
        account.balance = account.balance.add(amount);
        accountRepository.save(account)
        accountBalanceHistoryService.saveHistory(account)
    }

    @Transactional
    fun decreaseAccountBalanceByAmount(account: Account, amount: BigDecimal) {
        account.balance = account.balance.minus(amount);
        accountRepository.save(account)
        accountBalanceHistoryService.saveHistory(account)
    }

    @Transactional
    fun createAccount(spaceId: UUID, accountRequest: AccountRequest): AccountResponse {
        val isDefault = !accountRepository.existsBySpaceIdAndDefaultIsTrue(spaceId)

        val account = Account(
            id = null,
            name = accountRequest.name,
            description = null,
            balance = accountRequest.balance ?: BigDecimal.ZERO,
            monoBankId = null,
            currency = Currency.fromCode(accountRequest.currencyCode),
            type = AccountType.fromId(accountRequest.typeId),
            space = spaceRepository.findById(spaceId).orElseThrow { ResourceNotFoundException("Entity not found") },
            createdDate = LocalDateTime.now(),
            default = isDefault,
            transactionsSyncDate = null
        )

        return accountRepository.save(account).mapToResponse();
    }

    @Transactional
    fun createDefaultAccount(space: Space) {
        val account = Account(
            id = null,
            name = "Cash",
            description = null,
            balance = BigDecimal.ZERO,
            monoBankId = null,
            currency = Currency.UAH,
            type = AccountType.CASH,
            space = space,
            createdDate = LocalDateTime.now(),
            default = true,
            transactionsSyncDate = null
        )

        accountRepository.save(account);
    }

    @Transactional
    fun updateAccount(id: UUID, accountRequest: AccountRequest): AccountResponse {
        val account = getAccountById(id)
        val oldBalance = account.balance;

        account.name = accountRequest.name

        if (account.monoBankId == null) {
            account.currency = Currency.fromCode(accountRequest.currencyCode)
            account.balance = accountRequest.balance ?: BigDecimal.ZERO
        }

        accountRepository.save(account)

        if (oldBalance.compareTo(accountRequest.balance!!) != 0 && transactionRepository.existsByAccountId(id)) {
            createBalanceCorrectionTransaction(account, oldBalance)
            accountBalanceHistoryService.saveHistory(account)
        }

        return account.mapToResponse()
    }

    private fun createBalanceCorrectionTransaction(account: Account, oldBalance: BigDecimal) {
        val amount = account.balance.minus(oldBalance)

        val transaction = Transaction(
            id = null,
            name = "Balance correction",
            notes = "Happened due to account balance update",
            amount = amount.abs(),
            currency = account.currency,
            account = account,
            fromAccount = null,
            toAccount = null,
            date = LocalDateTime.now(),
            category = null,
            type = if (amount > BigDecimal.ZERO) TransactionType.INCOME else TransactionType.EXPENSE,
            createdDate = LocalDateTime.now(),
            currencyRate = null,
        )
        transactionRepository.save(transaction)
    }

    @Transactional(readOnly = true)
    fun getDefaultAccount(spaceId: UUID): AccountResponse {
        return accountRepository.findBySpaceIdAndDefaultIsTrue(spaceId).map { it.mapToResponse() }
            .orElseThrow { ResourceNotFoundException("No default account found") }
    }

    @Transactional
    fun updateDefaultAccount(spaceId: UUID, accountId: UUID) {
        val currentDefaultAccount = accountRepository.findBySpaceIdAndDefaultIsTrue(spaceId)
            .orElseThrow { ResourceNotFoundException("Entity not found") }
        if (currentDefaultAccount.id?.equals(accountId) == true) {
            return
        }
        currentDefaultAccount.default = false
        accountRepository.save(currentDefaultAccount)

        val newDefaultAccount =
            accountRepository.findById(accountId).orElseThrow { ResourceNotFoundException("Entity not found") }
        newDefaultAccount.default = true
        accountRepository.save(newDefaultAccount)
    }

    @Transactional(readOnly = true)
    fun getNetWorthResponse(spaceId: UUID): NetWorthResponse {
        val space = spaceRepository.findById(spaceId).orElseThrow { ResourceNotFoundException("Entity not found") }
        val exchangeRates = exchangeService.fetchExchangeRates()
        val primaryCurrency = space.primaryCurrency

        val totalBalance = accountRepository.findAllBySpaceId(spaceId).stream().map { account ->
            val currency = account.currency
            val balance = if (exchangeRates.isNotEmpty() && currency != primaryCurrency) {
                exchangeCurrency(exchangeRates, currency, primaryCurrency, account.balance)
            } else {
                account.balance
            }
            balance
        }.reduce(BigDecimal.ZERO, BigDecimal::add)

        return NetWorthResponse(
            totalAccountsBalance = totalBalance,
            primaryCurrency = primaryCurrency.mapToResponse(),
            histories = accountBalanceHistoryService.getHistoryForLastYear(spaceId)
        )
    }

    @Transactional(readOnly = true)
    fun getTypeGroupedAccounts(spaceId: UUID): List<TypeGroupedAccounts> {
        val space = spaceRepository.findById(spaceId).orElseThrow { ResourceNotFoundException("Entity not found") }
        val accounts = accountRepository.findAllBySpaceIdOrderByCreatedDate(spaceId)
        val groupedAccounts = accounts.stream().collect(Collectors.groupingBy { it.type })
        val exchangeRates = exchangeService.fetchExchangeRates()

        return groupedAccounts.entries.stream().map { entry ->
            val totalBalance = entry.value.stream()
                .map { account ->
                    val currency = account.currency
                    val balance = if (exchangeRates.isNotEmpty() && currency != space.primaryCurrency) {
                        exchangeCurrency(exchangeRates, currency, space.primaryCurrency, account.balance)
                    } else {
                        account.balance
                    }
                    balance
                }
                .reduce(BigDecimal.ZERO, BigDecimal::add)

            TypeGroupedAccounts(
                accountTypeId = entry.key.id,
                name = entry.key.fullName,
                primaryCurrency = space.primaryCurrency.mapToResponse(),
                accounts = entry.value.stream().map { it.mapToResponse() }.collect(Collectors.toList()),
                totalBalance = totalBalance
            )
        }
            .sorted { p1, p2 -> p1.accountTypeId.compareTo(p2.accountTypeId) }
            .toList()
    }

    private fun exchangeCurrency(
        exchangeRates: List<MonoBankExchangeRateResponse>,
        currency: Currency,
        primaryCurrency: Currency,
        balance: BigDecimal
    ): BigDecimal {
        val exchangeRate = exchangeRates.find { rate ->
            (rate.currencyCodeA == currency.code && rate.currencyCodeB == primaryCurrency.code)
                    || (rate.currencyCodeA == primaryCurrency.code && rate.currencyCodeB == currency.code)
        } ?: throw RuntimeException("Exchange rate not found")

        return balance.multiply(BigDecimal.valueOf(exchangeRate.rateBuy))
    }
}
