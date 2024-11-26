package com.agilepm.moneyminder.model.response

import java.io.Serializable
import java.util.*

data class RuleResponse(
    val id: UUID,
    val condition: ConditionResponse,
    val assignCategory: CategoryResponse?,
    val markAsTransferFromAccount: AccountShortResponse?,
    val markAsTransferToAccount: AccountShortResponse?
) : Serializable {

    data class ConditionResponse(
        val id: UUID? = null,
        val textToApply: String,
        val type: ConditionTypeResponse
    ) : Serializable {

        data class ConditionTypeResponse(
            val value: String,
            val description: String
        )
    }
}