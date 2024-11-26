package com.agilepm.moneyminder.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.util.*

@Entity
@Table(name = "mono_bank_info")
open class MonoBankInfo(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    open var id: UUID?,

    @Column(nullable = false)
    open var clientId: String,

    @Column(nullable = false)
    open var token: String,

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(nullable = false)
    open var space: Space
)