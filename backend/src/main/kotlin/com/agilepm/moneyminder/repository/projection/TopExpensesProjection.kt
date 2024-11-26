package com.agilepm.moneyminder.repository.projection

import com.agilepm.moneyminder.entity.Category
import com.agilepm.moneyminder.entity.Currency
import java.math.BigDecimal

interface TopExpensesProjection {

    fun getTotal(): BigDecimal

    fun getCategory(): Category?
}