package com.agilepm.moneyminder.model.request

import java.math.BigDecimal

data class LinkMonoBankAccountRequest(
    val id: String,
    val type: String,
    val balance: BigDecimal,
    val currencyCode: Int,
    val maskedPan: String?,
    val iban: String
)