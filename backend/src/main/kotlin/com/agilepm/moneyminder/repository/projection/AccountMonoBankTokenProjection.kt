package com.agilepm.moneyminder.repository.projection

import com.agilepm.moneyminder.entity.Account

interface AccountMonoBankTokenProjection {

    fun getMonoBankToken(): String

    fun getAccount(): Account
}