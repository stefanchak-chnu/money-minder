package com.agilepm.moneyminder.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.*

@Entity
@Table(name = "users")
open class User(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    open var id: UUID? = null,

    @Column(name = "username", nullable = false)
    open var username: String,

    @Column(name = "email", nullable = false, unique = true)
    open var email: String,

    @Column(name = "password")
    open var password: String?,

    @Column(name = "last_logged_in_space_id")
    open var lastLoggedInSpaceId: UUID?,
)
