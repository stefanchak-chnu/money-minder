package com.agilepm.moneyminder.model.response

data class CurrencyResponse(
    val code: Int,
    val fullName: String,
    val shortName: String,
    val sign: String
)