package com.agilepm.moneyminder.repository;

import com.agilepm.moneyminder.entity.Transaction
import java.time.LocalDateTime
import java.util.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Query

interface TransactionRepository : JpaRepository<Transaction, UUID>, JpaSpecificationExecutor<Transaction> {

    @Query("select t.monoBankId from Transaction t where t.account.space.id = :spaceId and t.date >= :date")
    fun findMonoBankIdsByDateGreaterThan(spaceId: UUID, date: LocalDateTime): List<String>

    @EntityGraph(attributePaths = ["account", "fromAccount", "toAccount", "category"])
    override fun findAll(specification: Specification<Transaction>, pageable: Pageable): Page<Transaction>

    fun existsByAccountId(accountId: UUID): Boolean
}