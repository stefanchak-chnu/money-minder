package com.agilepm.moneyminder.entity

import com.agilepm.moneyminder.model.response.AccountResponse
import com.agilepm.moneyminder.model.response.AccountShortResponse
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Index
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "accounts", indexes = [
    Index(name = "idx_account_space_id", columnList = "space_id, mono_bank_id"),
    Index(name = "idx_account_space_id_type_balance", columnList = "space_id, type, balance")
])
open class Account(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    open var id: UUID? = null,

    @Column(name = "name", nullable = false)
    open var name: String,

    @Column(name = "description", nullable = true)
    open var description: String?,

    @Column(name = "balance", nullable = false)
    open var balance: BigDecimal = BigDecimal.ZERO,

    @Enumerated(value = EnumType.STRING)
    @Column(name = "currency", nullable = false, updatable = true)
    open var currency: Currency,

    @Enumerated(value = EnumType.STRING)
    @Column(name = "type", nullable = false)
    open var type: AccountType,

    @Column(name = "is_default", nullable = true)
    open var default: Boolean = false,

    @Column(name = "created_date", nullable = false, updatable = false)
    open var createdDate: LocalDateTime,

    @Column(name = "transaction_sync_date")
    open var transactionsSyncDate: LocalDateTime?,

    @Column(name = "mono_bank_id", nullable = true, updatable = false)
    open var monoBankId: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    open var space: Space,
)

fun Account.mapToResponse(): AccountResponse {
    return AccountResponse(
        id = id,
        name = name,
        description = description,
        balance = balance,
        currency = currency.mapToResponse(),
        type = type.mapToResponse(),
        isBankAccount = monoBankId != null
    )
}

fun Account.mapToShortResponse(): AccountShortResponse {
    return AccountShortResponse(
        id = id!!,
        name = name,
        type = type.mapToResponse(),
    )
}