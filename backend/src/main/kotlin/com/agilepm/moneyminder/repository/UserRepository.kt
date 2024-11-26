package com.agilepm.moneyminder.repository;

import com.agilepm.moneyminder.entity.User
import java.util.*
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, UUID> {

    fun findByEmail(email: String): User?

    fun findByUsername(username: String): User?
}