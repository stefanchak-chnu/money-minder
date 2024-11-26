package com.agilepm.moneyminder.entity

import com.agilepm.moneyminder.model.response.RuleResponse
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.util.*

@Entity
@Table(name = "rules")
open class Rule(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    open var id: UUID? = null,

    @OneToOne(
        cascade = [CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE],
        optional = false,
        orphanRemoval = true
    )
    @JoinColumn(nullable = false, unique = true)
    open var condition: Condition,

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "assign_category_id")
    open var assignCategory: Category?,

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "mark_as_transfer_to_account_id")
    open var markAsTransferToAccount: Account?,

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "mark_as_transfer_from_account_id")
    open var markAsTransferFromAccount: Account?,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    open var space: Space,
)

fun Rule.mapToResponse(): RuleResponse {
    return RuleResponse(
        id = this.id ?: UUID.randomUUID(),
        condition = this.condition.mapToResponse(),
        assignCategory = this.assignCategory?.mapToResponse(),
        markAsTransferFromAccount = markAsTransferFromAccount?.mapToShortResponse(),
        markAsTransferToAccount = markAsTransferToAccount?.mapToShortResponse()
    )
}
