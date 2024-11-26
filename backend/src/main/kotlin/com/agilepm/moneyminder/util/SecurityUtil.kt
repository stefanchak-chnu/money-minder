package com.agilepm.moneyminder.util

import com.agilepm.moneyminder.security.CustomUserDetails
import jakarta.servlet.http.HttpServletRequest
import java.util.*
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource

class SecurityUtil {

    companion object {
        fun getCurrentUserSpaceId(): UUID {
            val userDetails = getUserDetailsFromSecurityContext()
            return userDetails.getSpaceId()
        }

        fun getCurrentUserId(): UUID {
            val userDetails = getUserDetailsFromSecurityContext()
            return userDetails.getUserId()
        }

        private fun getUserDetailsFromSecurityContext(): CustomUserDetails {
            val usernamePasswordAuthenticationToken =
                SecurityContextHolder.getContext().authentication as UsernamePasswordAuthenticationToken
            val userDetails = usernamePasswordAuthenticationToken.principal as CustomUserDetails
            return userDetails
        }

        fun updateContext(userId: UUID, spaceId: UUID, request: HttpServletRequest) {
            val userDetails = CustomUserDetails(
                userId = userId,
                spaceId = spaceId
            )

            val authToken = UsernamePasswordAuthenticationToken(userDetails, null, userDetails.authorities)
            authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
            SecurityContextHolder.getContext().authentication = authToken
        }
    }
}