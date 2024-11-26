package com.agilepm.moneyminder.repository;

import com.agilepm.moneyminder.entity.Category
import com.agilepm.moneyminder.entity.CategoryType
import com.agilepm.moneyminder.entity.TransactionType
import com.agilepm.moneyminder.repository.projection.TopExpensesProjection
import java.time.LocalDateTime
import java.util.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface CategoryRepository : JpaRepository<Category, UUID> {

    fun findAllBySpaceIdOrderByPosition(spaceId: UUID): List<Category>

    fun findAllBySpaceIdAndTypeOrderByPosition(spaceId: UUID, type: CategoryType): List<Category>

    @Query(
        """
        select 
            sum(COALESCE(t.amount, 0) * COALESCE(t.currencyRate, 1)) as total,
            c as category
        from Transaction t 
            left join t.category c 
        where t.account.space.id = :spaceId 
            and t.type = :transactionType
            and t.date >= :dateFrom 
            and t.date <= :dateTo
            and (c.id is null or c.id not in (:categoryIdsToExclude))
            and (:accountId is null or t.account.id = :accountId)
        group by c
        order by sum(COALESCE(t.amount, 0) * COALESCE(t.currencyRate, 1)) desc
    """
    )
    fun findTopExpenses(
        @Param("spaceId") spaceId: UUID,
        @Param("dateFrom") dateFrom: LocalDateTime,
        @Param("dateTo") dateTo: LocalDateTime,
        @Param("transactionType") transactionType: TransactionType,
        @Param("categoryIdsToExclude") categoryIdsToExclude: Set<UUID>,
        @Param("accountId") accountId: UUID?,
    ): List<TopExpensesProjection>
}