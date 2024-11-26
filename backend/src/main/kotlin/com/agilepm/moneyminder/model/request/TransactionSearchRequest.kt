package com.agilepm.moneyminder.model.request

import java.io.Serializable
import java.time.LocalDateTime
import java.util.*

data class TransactionSearchRequest(
    val name: String?,
    val notes: String?,
    val accountId: UUID? = null,
    val categoryId: UUID? = null,
    val needReview: Boolean? = false,
    val dateFrom: LocalDateTime? = LocalDateTime.now().withDayOfMonth(1),
    val dateTo: LocalDateTime? = LocalDateTime.now().withDayOfMonth(1).plusMonths(1).minusDays(1),
    val page: Int? = 0,
    val size: Int? = 5
) : Serializable