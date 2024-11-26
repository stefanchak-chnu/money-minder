package com.agilepm.moneyminder.service

import com.agilepm.moneyminder.entity.Currency
import com.agilepm.moneyminder.entity.Space
import com.agilepm.moneyminder.entity.mapToResponse
import com.agilepm.moneyminder.exceptions.ResourceNotFoundException
import com.agilepm.moneyminder.model.request.SpaceRequest
import com.agilepm.moneyminder.model.response.SpaceResponse
import com.agilepm.moneyminder.repository.SpaceRepository
import com.agilepm.moneyminder.repository.UserRepository
import com.agilepm.moneyminder.security.TokenService
import com.agilepm.moneyminder.util.SecurityUtil
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.time.LocalDateTime
import java.util.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SpaceService(
    private val spaceRepository: SpaceRepository,
    private val userRepository: UserRepository,
    private val tokenService: TokenService,
    private val categoryService: CategoryService,
    private val accountService: AccountService
) {

    @Transactional(readOnly = true)
    fun getSpaceResponse(spaceId: UUID): SpaceResponse {
        return spaceRepository.findById(spaceId).map { it.mapToResponse() }
            .orElseThrow { ResourceNotFoundException("Entity not found") }
    }

    @Transactional(readOnly = true)
    fun getSpaceResponses(userId: UUID): List<SpaceResponse> {
        return spaceRepository.findAllByUserIdOrderByCreatedDate(userId).map { it.mapToResponse() }
    }

    @Transactional
    fun createSpace(userId: UUID, spaceRequest: SpaceRequest): SpaceResponse {
        val user = userRepository.findById(userId).orElseThrow { ResourceNotFoundException("Entity not found") }

        val space = Space(
            id = null,
            name = spaceRequest.name,
            primaryCurrency = Currency.fromCode(spaceRequest.primaryCurrencyCode),
            user = user,
            createdDate = LocalDateTime.now(),
            updatedDate = LocalDateTime.now()
        )

        val savedSpace = spaceRepository.save(space)

        categoryService.initDefaultCategories(savedSpace)
        accountService.createDefaultAccount(savedSpace)

        return savedSpace.mapToResponse()
    }

    @Transactional
    fun updateSpaceName(spaceId: UUID, newName: String) {
        val space = spaceRepository.findById(spaceId).orElseThrow { ResourceNotFoundException("Entity not found") }
        space.name = newName
    }

    fun switchSpace(
        userId: UUID,
        spaceId: UUID,
        request: HttpServletRequest,
        response: HttpServletResponse
    ): SpaceResponse {
        val space = spaceRepository.findByIdAndUserId(spaceId, userId) ?: throw Exception("Space not found")

        val user = userRepository.findById(userId).orElseThrow { ResourceNotFoundException("Entity not found") }
        user.lastLoggedInSpaceId = space.id

        val token = tokenService.generate(userId, spaceId)
        response.addHeader("Token", token)

        SecurityUtil.updateContext(userId, spaceId, request)

        return space.mapToResponse()
    }
}
