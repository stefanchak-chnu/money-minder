package com.agilepm.moneyminder.service

import com.agilepm.moneyminder.entity.Account
import com.agilepm.moneyminder.entity.AccountType
import com.agilepm.moneyminder.entity.Currency
import com.agilepm.moneyminder.entity.MonoBankInfo
import com.agilepm.moneyminder.entity.Transaction
import com.agilepm.moneyminder.entity.TransactionType
import com.agilepm.moneyminder.entity.applyRule
import com.agilepm.moneyminder.entity.mapToResponse
import com.agilepm.moneyminder.exceptions.ResourceNotFoundException
import com.agilepm.moneyminder.model.request.LinkMonoBankAccountRequest
import com.agilepm.moneyminder.model.response.MonoBankAccountResponse
import com.agilepm.moneyminder.model.response.MonoBankTransactionResponse
import com.agilepm.moneyminder.repository.MonoBankInfoRepository
import com.agilepm.moneyminder.repository.RuleRepository
import com.agilepm.moneyminder.repository.SpaceRepository
import com.agilepm.moneyminder.repository.TransactionRepository
import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZoneOffset
import java.util.*
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange

@Service
class MonoBankService(
    private val monoBankInfoRepository: MonoBankInfoRepository,
    private val spaceRepository: SpaceRepository,
    private val accountService: AccountService,
    private val restTemplate: RestTemplate,
    private val transactionRepository: TransactionRepository,
    private val ruleRepository: RuleRepository,
    private val exchangeService: ExchangeService,
    @Value("\${monobank.api.url}") private val monoBankUrl: String
) {

    private val logger = LoggerFactory.getLogger(MonoBankService::class.java)

    @Transactional
    fun linkClient(spaceId: UUID, clientToken: String) {
        val clientId = fetchClientInfo(clientToken)
        if (clientId == null) {
            throw RuntimeException("Error fetching client info");
        } else {
            saveMonoBankInfo(spaceId, clientId, clientToken)
        }
    }

    private fun fetchClientInfo(clientToken: String): Any? {
        val uri = "$monoBankUrl/personal/client-info";

        val headers = HttpHeaders();
        headers.set("X-Token", "$clientToken")

        val requestEntity = HttpEntity<Any>(headers)

        val response = restTemplate.exchange<Map<String, Any>>(
            uri,
            HttpMethod.GET,
            requestEntity
        )

        if (response.statusCode != HttpStatusCode.valueOf(200)) {
            throw RuntimeException("Error fetching client info");
        }

        return response.body?.let { body -> body["clientId"] }
    }

    private fun saveMonoBankInfo(spaceId: UUID, clientId: Any, clientToken: String) {
        val space = spaceRepository.findById(spaceId).orElseThrow { ResourceNotFoundException("Entity not found") }
        val monoBankInfo = MonoBankInfo(null, clientId.toString(), clientToken, space)
        monoBankInfoRepository.save(monoBankInfo);
    }

    fun fetchAccounts(spaceId: UUID): List<MonoBankAccountResponse> {
        val monoBankInfo =
            monoBankInfoRepository.findBySpaceId(spaceId).orElseThrow { ResourceNotFoundException("Entity not found") }

        val uri = "$monoBankUrl/personal/client-info";

        val headers = HttpHeaders();
        headers.set("X-Token", "${monoBankInfo.token}")

        val requestEntity = HttpEntity<Any>(headers)

        val response = restTemplate.exchange<Map<String, Any>>(
            uri,
            HttpMethod.GET,
            requestEntity
        )

        if (response.statusCode != HttpStatusCode.valueOf(200)) {
            throw RuntimeException("Error fetching client info");
        }

        val accountsMap = response.body?.get("accounts") as? List<Map<String, Any>> ?: emptyList()

        val linkedMonoBankIds = accountService.getMonobankAccountIds(spaceId)

        return accountsMap.map { account ->
            MonoBankAccountResponse(
                id = account["id"] as String,
                type = account["type"] as String,
                balance = (account["balance"].toString()).toBigDecimal().divide(BigDecimal(100)),
                currency = Currency.fromCode(account["currencyCode"] as Int).mapToResponse(),
                maskedPan = (account["maskedPan"] as List<String>).firstOrNull(),
                iban = account["iban"] as String,
                isLinked = linkedMonoBankIds.contains(account["id"] as String)
            )
        }
    }

    @Transactional
    fun linkAccount(spaceId: UUID, request: LinkMonoBankAccountRequest) {
        val space = spaceRepository.findById(spaceId).orElseThrow { ResourceNotFoundException("Entity not found") }

        if (accountService.existsBySpaceIdAndMonoBankId(spaceId, request.id)) {
            throw RuntimeException("Account already linked");
        }

        val currency = Currency.fromCode(request.currencyCode)
        val accountName = "Monobank ${request.type} (${currency.name})"

        val savedAccount = accountService.saveAccount(
            Account(
                id = null,
                name = accountName,
                description = "Monobank | " + (request.maskedPan ?: request.iban),
                balance = request.balance,
                currency = currency,
                type = AccountType.BANK_ACCOUNTS,
                monoBankId = request.id,
                space = space,
                createdDate = LocalDateTime.now(),
                transactionsSyncDate = null
            )
        )

        val monoBankInfo =
            monoBankInfoRepository.findBySpaceId(spaceId).orElseThrow { ResourceNotFoundException("Entity not found") }

        updateRecentTransactionsFromMono(account = savedAccount, monoBankInfo.token)
    }

    fun fetchResentTransactions(accountId: String, token: String): List<MonoBankTransactionResponse> {
        val fromEpochTime = LocalDateTime.now().minusDays(31).plusHours(1).toEpochSecond(ZoneOffset.UTC)
        val uri = "$monoBankUrl/personal/statement/$accountId/$fromEpochTime";

        val headers = HttpHeaders();
        headers.set("X-Token", "${token}")

        val requestEntity = HttpEntity<Any>(headers)

        val response = restTemplate.exchange<List<MonoBankTransactionResponse>>(
            uri,
            HttpMethod.GET,
            requestEntity
        )

        if (response.statusCode != HttpStatusCode.valueOf(200)) {
            throw RuntimeException("Error fetching client info");
        }

        return response.body ?: emptyList()
    }

    @Transactional
    fun updateRecentTransactionsFromMono(account: Account, monoBankToken: String) {
        val monoBankAccountId = account.monoBankId ?: throw RuntimeException();

        try {
            val monoTransactions =
                fetchResentTransactions(monoBankAccountId, monoBankToken)

            val recentTransactionsMonoIds =
                transactionRepository.findMonoBankIdsByDateGreaterThan(
                    account.space.id!!,
                    LocalDateTime.now().minusDays(33)
                )

            val rules = ruleRepository.findAllBySpaceIdOrderByConditionTextToApplyAsc(account.space.id!!)

            val newTransactions = monoTransactions.stream()
                .filter { monoTransaction -> !recentTransactionsMonoIds.contains(monoTransaction.id) }
                .map { monoTransaction ->
                    val transactionType =
                        if (monoTransaction.operationAmount.toBigDecimal() > BigDecimal.ZERO) TransactionType.INCOME else TransactionType.EXPENSE

                    val now = LocalDateTime.now()
                    val zone = ZoneId.of("Europe/Kyiv")
                    val zoneOffSet = zone.rules.getOffset(now)
                    val date = LocalDateTime.ofEpochSecond(monoTransaction.time, 0, zoneOffSet)

                    val amount = monoTransaction.amount.toBigDecimal()
                        .divide(BigDecimal.valueOf(100))
                        .abs()

                    val transaction = Transaction(
                        id = null,
                        name = monoTransaction.description,
                        notes = monoTransaction.comment,
                        amount = amount,
                        currency = account.currency,
                        date = date,
                        monoBankId = monoTransaction.id,
                        account = account,
                        fromAccount = null,
                        toAccount = null,
                        category = null,
                        type = transactionType,
                        createdDate = date,
                        currencyRate = null
                    )

                    rules.stream().forEach { rule -> transaction.applyRule(rule) }

                    if (account.space.primaryCurrency.code != account.currency.code) {
                        val exchangeRate = exchangeService.fetchExchangeRates().find { rate ->
                            (rate.currencyCodeA == account.currency.code && rate.currencyCodeB == account.space.primaryCurrency.code)
                                    || (rate.currencyCodeA == account.space.primaryCurrency.code && rate.currencyCodeB == account.currency.code)
                        } ?: throw RuntimeException("Exchange rate not found")
                        transaction.currencyRate = BigDecimal.valueOf(exchangeRate.rateBuy)
                    }

                    return@map transaction
                }.toList()

            if (newTransactions.isNotEmpty()) {
                accountService.updateAccountBalanceFromMonoBank(account, monoTransactions.first().balance)
                transactionRepository.saveAll(newTransactions)
            }
            accountService.updateAccountTransactionSyncDate(account)
        } catch (httpEx: HttpClientErrorException) {
            if (httpEx.statusCode == HttpStatus.TOO_MANY_REQUESTS) {
                logger.warn("Too many requests to MonoBank API. Retrying in 1 minute...")
                Thread.sleep(1000 * 60)
                updateRecentTransactionsFromMono(account, monoBankToken)
            }
        } catch (ex: Exception) {
            throw RuntimeException("Error fetching recent transactions from Mono: ${ex.message}")
        }
    }

    @Transactional
    fun refreshRecentTransactionsFromMonoForSpace(spaceId: UUID) {
        accountService.getAllMonobankAccountsForSpace(spaceId).stream().forEach { projection ->
            updateRecentTransactionsFromMono(projection.getAccount(), projection.getMonoBankToken())
        }
    }
}
