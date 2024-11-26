package com.agilepm.moneyminder.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.LocalDate
import java.util.*

@Entity
@Table(name = "account_balance_history")
open class AccountBalanceHistory(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    open var id: UUID? = null,

    @Column(name = "balance", nullable = false)
    open var balance: BigDecimal = BigDecimal.ZERO,

    @Column(name = "date", nullable = false, updatable = false)
    open var date: LocalDate,

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "account_id", nullable = true)
    open var account: Account,
)

