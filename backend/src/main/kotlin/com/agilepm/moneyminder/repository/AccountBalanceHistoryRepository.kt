package com.agilepm.moneyminder.repository;

import com.agilepm.moneyminder.entity.AccountBalanceHistory
import java.time.LocalDate
import java.util.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AccountBalanceHistoryRepository : JpaRepository<AccountBalanceHistory, UUID> {

    @Query(
        """
        select t.id,
        t.account_id,
        t.balance,
        t.date
        from (
            select abh.id,
                   abh.account_id,
                   abh.balance,
                   abh.date,
                   row_number() over (
                       partition by abh.account_id, extract(month from abh.date)
                       order by abh.date desc
                   ) as rn
            from account_balance_history abh
                inner join public.accounts a on a.id = abh.account_id
            where a.space_id = :spaceId 
                and abh.date >= (current_date - interval '1 year')
        ) t
        where t.rn = 1
        order by t.date desc
        """,
        nativeQuery = true
    )
    fun findLastBalanceHistoryBySpaceId(@Param("spaceId") spaceId: UUID): List<AccountBalanceHistory>

    fun findByAccountIdAndDate(accountId: UUID, date: LocalDate): AccountBalanceHistory?

}