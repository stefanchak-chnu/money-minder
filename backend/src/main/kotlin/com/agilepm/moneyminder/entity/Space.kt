package com.agilepm.moneyminder.entity

import com.agilepm.moneyminder.model.response.SpaceResponse
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
import jakarta.persistence.Table
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate

@Entity
@Table(name = "spaces")
open class Space(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    open var id: UUID? = null,

    @Column(name = "name", nullable = false)
    open var name: String,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    open var user: User,

    @Enumerated(value = EnumType.STRING)
    @Column(name = "primary_currency", nullable = false, updatable = true)
    open var primaryCurrency: Currency = Currency.UAH,

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    open var createdDate: LocalDateTime,

    @LastModifiedDate
    @Column(name = "updated_date", nullable = false, updatable = false)
    open var updatedDate: LocalDateTime,
)

fun Space.mapToResponse(): SpaceResponse {
    return SpaceResponse(
        id = this.id!!,
        name = this.name,
        primaryCurrency = this.primaryCurrency.mapToResponse()
    )
}