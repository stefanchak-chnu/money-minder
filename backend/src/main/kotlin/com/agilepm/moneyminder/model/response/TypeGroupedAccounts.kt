package com.agilepm.moneyminder.model.response

import java.math.BigDecimal

data class TypeGroupedAccounts(
    val accountTypeId: Int,
    val name: String,
    val accounts: List<AccountResponse>,
    val totalBalance: BigDecimal,
    val primaryCurrency: CurrencyResponse,
)
