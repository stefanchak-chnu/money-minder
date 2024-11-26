package com.agilepm.moneyminder.model.request

import com.agilepm.moneyminder.entity.CategoryType
import java.io.Serializable

data class CategoryRequest(
    val name: String,
    val icon: String,
    val position: Int,
    val type: CategoryType
) : Serializable