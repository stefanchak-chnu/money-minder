package com.agilepm.moneyminder.security

import com.agilepm.moneyminder.properties.JwtProperties
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import java.util.*
import org.springframework.stereotype.Service

@Service
class TokenService(
    private val jwtProperties: JwtProperties
) {

    private val secretKey = Keys.hmacShaKeyFor(
        jwtProperties.key.toByteArray()
    )

    fun generate(
        userId: UUID,
        spaceId: UUID
    ): String {
        return Jwts.builder()
            .claims()
            .subject(userId.toString())
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(Date(System.currentTimeMillis() + jwtProperties.accessTokenExpiration * 1000))
            .add(mapOf("spaceId" to spaceId.toString()))
            .and()
            .signWith(secretKey)
            .compact()
    }

    fun extractUserId(token: String): UUID {
        return UUID.fromString(
            getAllClaims(token)
                .subject
        )
    }

    fun extractSpaceId(token: String): UUID {
        return UUID.fromString(
            getAllClaims(token)
                .getValue("spaceId") as String
        )
    }

    fun isExpired(token: String): Boolean =
        getAllClaims(token)
            .expiration
            .before(Date(System.currentTimeMillis()))

    private fun getAllClaims(token: String): Claims {
        val parser = Jwts.parser()
            .verifyWith(secretKey)
            .build()

        return parser
            .parseSignedClaims(token)
            .payload
    }
}