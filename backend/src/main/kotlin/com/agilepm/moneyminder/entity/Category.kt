package com.agilepm.moneyminder.entity

import com.agilepm.moneyminder.model.response.CategoryResponse
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
import java.util.*

@Entity
@Table(name = "categories", indexes = [
    Index(name = "idx_category_space_id_type", columnList = "space_id, type")
])
open class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    open var id: UUID? = null,

    @Column(name = "name", nullable = false)
    open var name: String,

    @Column(name = "icon", nullable = false)
    open var icon: String,

    @Column(name = "position", nullable = false)
    open var position: Int,

    @Enumerated(value = EnumType.STRING)
    @Column(name = "type", nullable = false, updatable = false)
    open var type: CategoryType,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    open var space: Space,

    @Column(name = "parent_id", nullable = true)
    open var parentId: UUID?,
)

fun Category.mapToResponse() = CategoryResponse(
    id = this.id,
    name = this.name,
    icon = this.icon,
    position = this.position,
    type = this.type
)