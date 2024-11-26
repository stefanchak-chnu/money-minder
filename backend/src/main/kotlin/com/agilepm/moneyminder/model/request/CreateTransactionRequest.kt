package com.agilepm.moneyminder.model.request

import com.agilepm.moneyminder.entity.Currency
import com.agilepm.moneyminder.entity.TransactionType
import java.io.Serializable
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*

data class CreateTransactionRequest(
    val name: String,
    val notes: String? = null,
    val currency: Currency,
    val amount: BigDecimal = BigDecimal.ZERO,
    val date: LocalDateTime,
    val accountId: UUID,
    val fromAccountId: UUID?,
    val toAccountId: UUID?,
    val categoryId: UUID?,
    val type: TransactionType
) : Serializable