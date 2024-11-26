package com.agilepm.moneyminder.service

import com.agilepm.moneyminder.entity.Currency
import com.agilepm.moneyminder.entity.Space
import com.agilepm.moneyminder.entity.User
import com.agilepm.moneyminder.exceptions.ResourceNotFoundException
import com.agilepm.moneyminder.model.response.UserResponse
import com.agilepm.moneyminder.repository.SpaceRepository
import com.agilepm.moneyminder.repository.UserRepository
import java.time.LocalDateTime
import java.util.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val spaceRepository: SpaceRepository,
    private val categoryService: CategoryService,
    private val accountService: AccountService
) {

    @Transactional(readOnly = true)
    fun getCurrentUserResponse(userId: UUID): UserResponse {
        val user = userRepository.findById(userId).orElseThrow { ResourceNotFoundException("Entity not found") }
        return user.let {
            UserResponse(
                email = it.email,
                username = it.username
            )
        }
    }

    @Transactional(readOnly = true)
    fun findByEmail(email: String): User? {
        return userRepository.findByEmail(email)
    }

    @Transactional(readOnly = true)
    fun findByUsername(username: String): User? {
        return userRepository.findByUsername(username)
    }

    @Transactional(readOnly = true)
    fun createNewUser(email: String, username: String): User {
        val user = userRepository.save(User(null, username, email, null, null))
        val space = initSpaceForUser(user)
        user.lastLoggedInSpaceId = space.id
        userRepository.save(user)
        return user
    }

    private fun initSpaceForUser(user: User): Space {
        val space = spaceRepository.save(Space(null, "Personal", user, Currency.UAH, LocalDateTime.now(), LocalDateTime.now()))
        categoryService.initDefaultCategories(space)
        accountService.createDefaultAccount(space)
        return space
    }
}
