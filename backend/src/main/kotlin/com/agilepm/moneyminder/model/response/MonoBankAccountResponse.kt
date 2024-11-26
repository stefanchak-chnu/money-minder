package com.agilepm.moneyminder.model.response

import java.math.BigDecimal

data class MonoBankAccountResponse(
    val id: String,
    val type: String,
    val balance: BigDecimal,
    val currency: CurrencyResponse,
    val maskedPan: String?,
    val iban: String,
    val isLinked: Boolean
)