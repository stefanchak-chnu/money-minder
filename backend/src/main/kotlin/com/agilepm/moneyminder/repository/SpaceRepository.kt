package com.agilepm.moneyminder.repository;

import com.agilepm.moneyminder.entity.Space
import java.util.*
import org.springframework.data.jpa.repository.JpaRepository

interface SpaceRepository : JpaRepository<Space, UUID> {

    fun findAllByUserIdOrderByCreatedDate(userId: UUID): List<Space>

    fun findByIdAndUserId(id: UUID, userId: UUID): Space?
}