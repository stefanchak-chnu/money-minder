package com.agilepm.moneyminder.model.response

data class MonoBankExchangeRateResponse(
    val currencyCodeA: Int,
    val currencyCodeB: Int,
    val date: Long,
    val rateBuy: Double,
    val rateSell: Double
)