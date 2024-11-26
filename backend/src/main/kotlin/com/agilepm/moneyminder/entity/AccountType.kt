package com.agilepm.moneyminder.entity

import com.agilepm.moneyminder.model.response.AccountTypeResponse

enum class AccountType(val id: Int, val fullName: String, val iconName: String) {
    BANK_ACCOUNTS(1, "Bank accounts", "card"),
    CASH(2, "Cash", "money-bag"),
    STOCKS_CRYPTO(3, "Stocks & Crypto", "align"),
    OTHER_ASSETS(4, "Other assets", "box");

    companion object {
        fun fromId(id: Int): AccountType {
            return entries.find { it.id == id }
                ?: throw IllegalArgumentException("Type with id $id not found")
        }
    }
}

fun AccountType.mapToResponse(): AccountTypeResponse {
    return AccountTypeResponse(
        id = this.id,
        fullName = this.fullName,
        iconName = this.iconName
    )
}