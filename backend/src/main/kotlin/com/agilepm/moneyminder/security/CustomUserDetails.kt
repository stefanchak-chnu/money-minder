package com.agilepm.moneyminder.security

import java.util.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails(private val userId: UUID, private val spaceId: UUID) : UserDetails {

    fun getUserId(): UUID {
        return userId;
    }

    fun getSpaceId(): UUID {
        return spaceId;
    }

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableListOf()
    }

    override fun getPassword(): String {
        return "";
    }

    override fun getUsername(): String {
        return "";
    }

    override fun isAccountNonExpired(): Boolean {
        return true

    }

    override fun isAccountNonLocked(): Boolean {
        return true

    }

    override fun isCredentialsNonExpired(): Boolean {
        return true

    }

    override fun isEnabled(): Boolean {
        return true
    }
}