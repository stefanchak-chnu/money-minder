package com.agilepm.moneyminder.model.response

import java.io.Serializable
import java.math.BigDecimal
import java.util.*

data class BankResponse(
    val id: UUID?,
    val name: String,
    val type: BankType
) : Serializable {

    enum class BankType {
        MONOBANK
    }
}