package com.agilepm.moneyminder.security

import com.agilepm.moneyminder.entity.User
import com.agilepm.moneyminder.model.request.LoginRequest
import com.agilepm.moneyminder.model.response.AuthenticationResponse
import com.agilepm.moneyminder.service.UserService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userService: UserService,
    private val bcryptPasswordEncoder: BCryptPasswordEncoder,
    private val tokenService: TokenService
) {

    @Transactional
    fun findAndAuthenticateUser(loginRequest: LoginRequest): AuthenticationResponse {
        val user: User =
            userService.findByUsername(loginRequest.username) ?: throw IllegalArgumentException("Invalid credentials");

        if (!bcryptPasswordEncoder.matches(loginRequest.password, user.password)) {
            throw IllegalArgumentException("Invalid credentials");
        }

        val token = tokenService.generate(user.id!!, user.lastLoggedInSpaceId!!)

        return AuthenticationResponse(token)
    }

    fun encodePassword(password: String): String {
        return bcryptPasswordEncoder.encode(password)
    }
}
