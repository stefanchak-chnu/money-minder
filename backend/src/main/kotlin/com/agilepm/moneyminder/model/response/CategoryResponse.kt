package com.agilepm.moneyminder.model.response

import com.agilepm.moneyminder.entity.CategoryType
import java.io.Serializable
import java.util.*

data class CategoryResponse(
    val id: UUID? = null,
    val name: String? = null,
    val icon: String? = null,
    val position: Int? = null,
    val type: CategoryType? = null,
    var subCategories: List<CategoryResponse>? = emptyList(),
) : Serializable