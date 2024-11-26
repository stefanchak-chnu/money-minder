package com.agilepm.moneyminder.model.response

import java.io.Serializable
import java.math.BigDecimal
import java.util.*

data class NetWorthResponse(
    val totalAccountsBalance: BigDecimal,
    val primaryCurrency: CurrencyResponse,
    val histories: List<NetWorthHistory>
) : Serializable