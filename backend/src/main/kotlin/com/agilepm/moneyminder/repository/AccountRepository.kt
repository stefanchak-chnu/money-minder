package com.agilepm.moneyminder.repository;

import com.agilepm.moneyminder.entity.Account
import com.agilepm.moneyminder.repository.projection.AccountMonoBankTokenProjection
import java.time.LocalDateTime
import java.util.*
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AccountRepository : JpaRepository<Account, UUID> {

    fun existsBySpaceIdAndMonoBankId(spaceId: UUID, monoBankId: String): Boolean

    fun existsBySpaceIdAndDefaultIsTrue(spaceId: UUID): Boolean

    @Query("select a.monoBankId from Account a where a.space.id = :spaceId and a.monoBankId is not null")
    fun findAllMonoBankIdsBySpaceId(spaceId: UUID): List<String>

    @EntityGraph(attributePaths = ["space"])
    @Query(
        """
        select mbf.token as monoBankToken, a as account
        from Account a 
        inner join a.space s
        inner join MonoBankInfo mbf on mbf.space.id = s.id
        where a.monoBankId is not null and (a.transactionsSyncDate < :transactionSyncDate or a.transactionsSyncDate is null)
    """
    )
    fun findAllByMonoBankIdIsNotNull(@Param("transactionSyncDate") transactionSyncDate: LocalDateTime): List<AccountMonoBankTokenProjection>

    @Query(
        """
        select mbf.token as monoBankToken, a as account
        from Account a 
        inner join a.space s
        inner join MonoBankInfo mbf on mbf.space.id = s.id
        where s.id = :spaceId and a.monoBankId is not null
    """
    )
    fun findAllBySpaceIdAndMonoBankIdIsNotNull(@Param("spaceId") spaceId: UUID): List<AccountMonoBankTokenProjection>

    fun findAllBySpaceId(spaceId: UUID): List<Account>

    fun findAllBySpaceIdOrderByCreatedDate(spaceId: UUID): List<Account>

    fun findAllBySpaceIdAndMonoBankIdIsNullOrderByCreatedDate(spaceId: UUID): List<Account>

    fun findBySpaceIdAndDefaultIsTrue(spaceId: UUID): Optional<Account>
}