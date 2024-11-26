package com.agilepm.moneyminder.model.response

import java.io.Serializable

data class PageResponse<T>(
    val content: List<T>,
    val pageNumber: Int,
    val pageSize: Int,
    val totalElements: Long,
    val totalPages: Int,
    val last: Boolean
) : Serializable