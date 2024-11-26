package com.agilepm.moneyminder.security

import com.google.api.client.auth.oauth2.AuthorizationCodeResponseUrl
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.agilepm.moneyminder.model.response.AuthenticationResponse
import com.agilepm.moneyminder.properties.GoogleProperties
import com.agilepm.moneyminder.service.UserService
import io.jsonwebtoken.io.IOException
import java.util.*
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.authentication.AuthenticationServiceException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

private const val USER_INFO_EMAIL: String = "https://www.googleapis.com/auth/userinfo.email"
private const val USER_INFO_PROFILE: String = "https://www.googleapis.com/auth/userinfo.profile"
private const val GOOGLE_ACCOUNT_STATE: String = "/profile"

@Service
class GoogleAuthService(
    private val googleProperties: GoogleProperties,
    private val userService: UserService,
    private val tokenService: TokenService
) {

    @Transactional
    fun findAndAuthenticateUser(stringBuffer: StringBuffer): AuthenticationResponse {
        val authResponse: AuthorizationCodeResponseUrl = checkAuthorizationResponse(stringBuffer)
        val tokenResponse = getGoogleTokenResponse(authResponse.code)
        val payload = getGoogleTokenPayload(tokenResponse)
        val email = payload.email
        val username = payload["name"] as String

        var user = userService.findByEmail(email)
        if (user == null) {
            user = userService.createNewUser(email, username);
        }

        val token = tokenService.generate(user.id!!, user.lastLoggedInSpaceId!!)

        return AuthenticationResponse(token)
    }

    private fun checkAuthorizationResponse(stringBuffer: StringBuffer): AuthorizationCodeResponseUrl {
        val authResponse = AuthorizationCodeResponseUrl(stringBuffer.toString())

        if (Objects.nonNull(authResponse.error)) {
            throw AccessDeniedException("Access denied!")
        }

        return authResponse
    }

    private fun getGoogleTokenPayload(tokenResponse: GoogleTokenResponse): GoogleIdToken.Payload {
        val payload: GoogleIdToken.Payload

        try {
            payload = tokenResponse.parseIdToken().payload
        } catch (e: IOException) {
            throw AuthenticationServiceException("Failed to connect to Google authentication server")
        }

        return payload
    }

    private fun getGoogleTokenResponse(code: String): GoogleTokenResponse {
        return GoogleAuthorizationCodeTokenRequest(
            NetHttpTransport(),
            GsonFactory.getDefaultInstance(),
            googleProperties.clientId,
            googleProperties.clientSecret,
            code,
            googleProperties.redirectUri
        )
            .execute()
    }

    fun getUri(): String {
        val authorizationCodeRequestUrl = GoogleAuthorizationCodeRequestUrl(
            googleProperties.clientId,
            googleProperties.redirectUri,
            listOf(USER_INFO_EMAIL, USER_INFO_PROFILE)
        )
        return authorizationCodeRequestUrl
            .setState(GOOGLE_ACCOUNT_STATE)
            .build()
    }

}