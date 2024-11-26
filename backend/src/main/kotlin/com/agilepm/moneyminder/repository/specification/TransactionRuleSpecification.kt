package com.agilepm.moneyminder.repository.specification

import com.agilepm.moneyminder.entity.Account
import com.agilepm.moneyminder.entity.ConditionType
import com.agilepm.moneyminder.entity.Rule
import com.agilepm.moneyminder.entity.Space
import com.agilepm.moneyminder.entity.Transaction
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.JoinType
import jakarta.persistence.criteria.Predicate
import jakarta.persistence.criteria.Root
import java.util.*
import org.springframework.data.jpa.domain.Specification

class TransactionRuleSpecification(
    private val rule: Rule,
    private val spaceId: UUID
) : Specification<Transaction> {

    override fun toPredicate(
        root: Root<Transaction>,
        query: CriteriaQuery<*>,
        cb: CriteriaBuilder
    ): Predicate? {
        val predicates = mutableListOf<Predicate>()

        if (rule.condition.type == ConditionType.TEXT_CONTAINS) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%${rule.condition.textToApply.lowercase()}%"))
        } else if (rule.condition.type == ConditionType.TEXT_EQUALS) {
            predicates.add(cb.like(cb.lower(root.get("name")), rule.condition.textToApply.lowercase()))
        }

        val accountRoot = root.join<Transaction, Account>("account", JoinType.INNER)
        predicates.add(cb.equal(accountRoot.get<Space>("space").get<UUID>("id"), spaceId))

        return predicates.takeIf { it.isNotEmpty() }?.let { cb.and(*it.toTypedArray()) }
    }
}