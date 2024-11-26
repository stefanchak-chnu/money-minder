package com.agilepm.moneyminder.entity

import com.agilepm.moneyminder.model.response.CurrencyResponse

enum class Currency(val code: Int, val fullName: String, val sign: String) {
    UAH(980, "Hryvnia", "₴"),
    USD(840, "United States Dollar", "$"),
    EUR(978, "Euro", "€"),
    TRY(949, "Turkish Lire", "₺");

    companion object {
        fun fromCode(code: Int): Currency {
            return entries.find { it.code == code }
                ?: throw IllegalArgumentException("Currency with code $code not found")
        }
    }
}

fun Currency.mapToResponse(): CurrencyResponse {
    return CurrencyResponse(
        code = this.code,
        fullName = this.fullName,
        shortName = this.name,
        sign = this.sign
    )
}