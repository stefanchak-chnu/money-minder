package com.agilepm.moneyminder.model.request

import java.io.Serializable
import java.math.BigDecimal

data class AccountRequest(
    val name: String,
    val balance: BigDecimal?,
    val currencyCode: Int,
    val typeId: Int
) : Serializable