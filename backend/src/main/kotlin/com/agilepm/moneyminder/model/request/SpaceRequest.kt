package com.agilepm.moneyminder.model.request

import java.io.Serializable

data class SpaceRequest(
    val name: String,
    val primaryCurrencyCode: Int
) : Serializable