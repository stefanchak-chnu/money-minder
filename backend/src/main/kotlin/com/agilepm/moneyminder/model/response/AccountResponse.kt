package com.agilepm.moneyminder.model.response

import java.io.Serializable
import java.math.BigDecimal
import java.util.*

data class AccountResponse(
    val id: UUID?,
    val name: String,
    val description: String?,
    val balance: BigDecimal = BigDecimal.ZERO,
    val currency: CurrencyResponse,
    val type: AccountTypeResponse,
    val isBankAccount: Boolean
) : Serializable