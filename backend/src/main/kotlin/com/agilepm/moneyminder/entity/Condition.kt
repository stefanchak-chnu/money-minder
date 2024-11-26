package com.agilepm.moneyminder.entity

import com.agilepm.moneyminder.model.response.RuleResponse
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
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
@Table(name = "conditions")
open class Condition(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    open var id: UUID? = null,

    @Column(name = "text_to_apply", nullable = false)
    open var textToApply: String,

    @Enumerated(value = EnumType.STRING)
    @Column(name = "currency", nullable = false, updatable = true)
    open var type: ConditionType
)

fun Condition.mapToResponse(): RuleResponse.ConditionResponse {
    return RuleResponse.ConditionResponse(
        id = this.id,
        textToApply = this.textToApply,
        type = RuleResponse.ConditionResponse.ConditionTypeResponse(type.name, type.description)
    )
}
