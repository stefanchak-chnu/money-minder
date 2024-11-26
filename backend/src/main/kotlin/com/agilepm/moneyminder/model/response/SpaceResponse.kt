package com.agilepm.moneyminder.model.response

import java.io.Serializable
import java.util.*

data class SpaceResponse(
    val id: UUID,
    val name: String,
    val primaryCurrency: CurrencyResponse
) : Serializable