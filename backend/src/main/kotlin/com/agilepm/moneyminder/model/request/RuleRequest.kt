package com.agilepm.moneyminder.model.request

import com.agilepm.moneyminder.entity.ConditionType
import java.io.Serializable
import java.math.BigDecimal
import java.util.*

data class RuleRequest(
    val conditionType: ConditionType,
    val conditionText: String,
    val assignCategoryId: UUID?,
    val markAsTransferFromAccountId: UUID?,
    val markAsTransferToAccountId: UUID?
) : Serializable