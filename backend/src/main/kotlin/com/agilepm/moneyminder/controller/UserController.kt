package com.agilepm.moneyminder.controller

import com.agilepm.moneyminder.model.response.UserResponse
import com.agilepm.moneyminder.service.UserService
import com.agilepm.moneyminder.util.SecurityUtil
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/users")
class UserController(
    private val userService: UserService
) {

    @GetMapping("/current")
    fun getCurrentUser(): UserResponse {
        return userService.getCurrentUserResponse(SecurityUtil.getCurrentUserId())
    }
}