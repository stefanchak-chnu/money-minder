package com.agilepm.moneyminder.security

import com.agilepm.moneyminder.properties.JwtProperties
import java.util.*
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
class TokenServiceTest {

    private var tokenService: TokenService =
        TokenService(JwtProperties(key = "supersecretkeywithlonglenghtlikealot", accessTokenExpiration = 1814400))

    @Test
    fun generate() {
        val token = tokenService.generate(
            UUID.fromString("cfae5154-d485-4c56-a3ba-aae197dab775"),
            UUID.fromString("d88d5b63-204e-425d-9d58-5d42140cf300")
        )
        println(token)
        assertNotNull(token)
    }
}