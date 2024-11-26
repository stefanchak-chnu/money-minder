package com.agilepm.moneyminder.entity

import com.agilepm.moneyminder.model.response.TransactionResponse
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
@Table(name = "transactions", indexes = [
    Index(name = "idx_transaction_account_id", columnList = "account_id, category_id, mono_bank_id"),
    Index(name = "idx_transaction_date", columnList = "date, account_id")
])
open class Transaction(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    open var id: UUID? = null,

    @Column(name = "name", nullable = false)
    open var name: String,

    @Column(name = "notes", nullable = true)
    open var notes: String?,

    @Column(name = "amount", nullable = false)
    open var amount: BigDecimal = BigDecimal.ZERO,

    // used for tracking currency rate at a transaction creation date in order to convert amount later for spending history
    // stores value only when currency is different from space primary currency
    @Column(name = "currency_rate", nullable = true)
    open var currencyRate: BigDecimal?,

    @Enumerated(value = EnumType.STRING)
    @Column(name = "currency", nullable = false, updatable = true)
    open var currency: Currency,

    @Enumerated(value = EnumType.STRING)
    @Column(name = "type", nullable = false)
    open var type: TransactionType,

    @Column(name = "date", nullable = false)
    open var date: LocalDateTime,

    @Column(name = "created_date", nullable = false, updatable = false)
    open var createdDate: LocalDateTime,

    @Column(name = "mono_bank_id", nullable = true, updatable = false)
    open var monoBankId: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    open var account: Account,

    // used only for transfer transactions
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "from_account_id", nullable = true)
    open var fromAccount: Account?,

    // used only for transfer transactions
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "to_account_id", nullable = true)
    open var toAccount: Account?,

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "category_id")
    open var category: Category? = null
)

fun Transaction.mapToResponse() = TransactionResponse(
    id = this.id ?: UUID.randomUUID(),
    name = this.name,
    notes = this.notes,
    amount = this.amount,
    currency = this.currency.mapToResponse(),
    account = this.account.mapToResponse(),
    fromAccount = this.fromAccount?.mapToResponse(),
    toAccount = this.toAccount?.mapToResponse(),
    date = this.date,
    category = this.category?.mapToResponse(),
    type = this.type,
    isBankTransaction = this.monoBankId != null
)

fun Transaction.applyRule(rule: Rule) {
    if (rule.condition.type == ConditionType.TEXT_CONTAINS && this.name.contains(rule.condition.textToApply)) {
        applyRuleActions(rule)
    } else if (rule.condition.type == ConditionType.TEXT_EQUALS && this.name == rule.condition.textToApply) {
        applyRuleActions(rule)
    }
}

private fun Transaction.applyRuleActions(rule: Rule) {
    if (rule.assignCategory != null) {
        this.category = rule.assignCategory
    } else if (rule.markAsTransferToAccount != null) {
        this.type = TransactionType.TRANSFER
        this.toAccount = rule.markAsTransferToAccount
        this.fromAccount = this.account;
    } else if (rule.markAsTransferFromAccount != null) {
        this.type = TransactionType.TRANSFER
        this.fromAccount = rule.markAsTransferFromAccount
        this.toAccount = this.account;
    }
}