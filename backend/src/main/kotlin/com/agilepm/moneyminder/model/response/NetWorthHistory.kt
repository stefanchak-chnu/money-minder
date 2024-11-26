package com.agilepm.moneyminder.model.response

import java.io.Serializable
import java.math.BigDecimal

data class NetWorthHistory(
    val balance: BigDecimal,
    val date: String
) : Serializable