package com.agilepm.moneyminder.repository;

import com.agilepm.moneyminder.entity.Rule
import java.util.*
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository

interface RuleRepository : JpaRepository<Rule, UUID> {

    @EntityGraph(attributePaths = ["condition", "assignCategory"])
    fun findAllBySpaceIdOrderByConditionTextToApplyAsc(spaceId: UUID): List<Rule>
}