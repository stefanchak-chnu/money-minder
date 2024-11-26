package com.agilepm.moneyminder.model.response

import java.io.Serializable
import java.math.BigDecimal

data class TopExpenseResponse(
    val total: BigDecimal,
    val category: CategoryResponse?,
) : Serializable