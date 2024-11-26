package com.agilepm.moneyminder.service

import com.agilepm.moneyminder.entity.Account
import com.agilepm.moneyminder.entity.AccountBalanceHistory
import com.agilepm.moneyminder.model.response.NetWorthHistory
import com.agilepm.moneyminder.repository.AccountBalanceHistoryRepository
import java.math.BigDecimal
import java.time.LocalDate
import java.time.Month
import java.time.format.DateTimeFormatter
import java.util.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

val DATE_FORMATTER: DateTimeFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy").withLocale(Locale.UK)

@Service
class AccountBalanceHistoryService(
    private val repository: AccountBalanceHistoryRepository,
    private val exchangeService: ExchangeService
) {

    @Transactional(readOnly = true)
    fun getHistoryForLastYear(spaceId: UUID): List<NetWorthHistory> {
        val historyList = repository.findLastBalanceHistoryBySpaceId(spaceId)
        val map = mutableMapOf<Month, MutableList<AccountBalanceHistory>>()

        historyList.stream().forEach { history ->
            run {
                val month = map.keys.firstOrNull { it == history.date.month }
                if (month == null) {
                    map[history.date.month] = mutableListOf(history)
                } else {
                    map[month]?.add(history)
                }
            }
        }

        val netWorthHistories = mutableListOf<NetWorthHistory>()

        map.entries.forEach { entry ->
            run {
                val totalBalance = entry.value.stream().map { h -> h.balance }.reduce(BigDecimal.ZERO, BigDecimal::add)
                val formattedDate = entry.value.map { h -> h.date }.first().format(DATE_FORMATTER)
                netWorthHistories.add(NetWorthHistory(totalBalance, formattedDate))
            }
        }

        return netWorthHistories
    }

    @Transactional
    fun saveHistory(account: Account) {
        val balance = convertBalanceToSpaceCurrency(account)
        val today = LocalDate.now()

        val existingHistory = repository.findByAccountIdAndDate(account.id!!, today)

        if (existingHistory != null) {
            existingHistory.balance = balance
            repository.save(existingHistory)
        } else {
            repository.save(
                AccountBalanceHistory(
                    id = null,
                    balance = balance,
                    date = today,
                    account = account
                )
            )
        }
    }

    private fun convertBalanceToSpaceCurrency(account: Account): BigDecimal {
        var balance = account.balance
        if (account.currency != account.space.primaryCurrency) {
            val exchangeRates = exchangeService.fetchExchangeRates()
            if (exchangeRates.isNotEmpty()) {
                val exchangeRate = exchangeRates.find { rate ->
                    (rate.currencyCodeA == account.currency.code && rate.currencyCodeB == account.space.primaryCurrency.code)
                            || (rate.currencyCodeA == account.space.primaryCurrency.code && rate.currencyCodeB == account.currency.code)
                } ?: throw RuntimeException("Exchange rate not found")
                balance = balance.multiply(BigDecimal.valueOf(exchangeRate.rateBuy))
            } else {
                Thread.sleep(1000)
                return convertBalanceToSpaceCurrency(account)
            }
        }
        return balance
    }
}
