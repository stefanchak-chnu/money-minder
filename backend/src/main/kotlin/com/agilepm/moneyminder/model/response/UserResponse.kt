package com.agilepm.moneyminder.model.response

import java.io.Serializable

data class UserResponse(
    val username: String,
    val email: String
) : Serializable