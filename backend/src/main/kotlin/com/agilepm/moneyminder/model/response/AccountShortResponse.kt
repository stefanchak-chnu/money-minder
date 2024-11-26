package com.agilepm.moneyminder.model.response

import java.io.Serializable
import java.util.*

data class AccountShortResponse(
    val id: UUID,
    val name: String,
    val type: AccountTypeResponse,
) : Serializable