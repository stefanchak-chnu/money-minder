package com.agilepm.moneyminder.controller

import com.agilepm.moneyminder.model.request.LoginRequest
import com.agilepm.moneyminder.model.response.AuthenticationResponse
import com.agilepm.moneyminder.security.AuthService
import com.agilepm.moneyminder.security.GoogleAuthService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping
class AuthController(
    private val googleAuthService: GoogleAuthService,
    private val authService: AuthService,
    @Value("\${client.host}") private val clientHost: String
) {

    @GetMapping("/login")
    fun login(response: HttpServletResponse) {
        response.sendRedirect(googleAuthService.getUri());
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    fun loginWithCredentials(@RequestBody loginRequest: LoginRequest, response: HttpServletResponse): AuthenticationResponse {
        return authService.findAndAuthenticateUser(loginRequest)
    }

    // help method to generate random password hash. Only for testing purposes.
    @GetMapping("/password/encode")
    fun encodePassword(@RequestParam password: String): String {
        return authService.encodePassword(password)
    }

    @GetMapping("/google/oauth2callback")
    @ResponseStatus(HttpStatus.OK)
    fun googleCallback(request: HttpServletRequest, response: HttpServletResponse) {
        val fullUrlBuffer = request.requestURL
        if (request.queryString != null) {
            fullUrlBuffer.append('?').append(request.queryString)
        }

        val authResponse = googleAuthService.findAndAuthenticateUser(fullUrlBuffer)

        response.sendRedirect(
            clientHost + "/auth?accessToken=" + authResponse.token
        )
    }

}