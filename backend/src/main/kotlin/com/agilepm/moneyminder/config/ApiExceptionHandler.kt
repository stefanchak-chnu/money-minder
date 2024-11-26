package com.agilepm.moneyminder.config

import com.agilepm.moneyminder.exceptions.ResourceNotFoundException
import com.agilepm.moneyminder.model.response.ApiErrorResponse
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ApiExceptionHandler {

    @ExceptionHandler
    fun handleResourceNotFoundException(ex: ResourceNotFoundException): ResponseEntity<ApiErrorResponse> {
        val errorMessage = ApiErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.localizedMessage
        )
        return ResponseEntity(errorMessage, HttpStatus.NOT_FOUND)
    }

    @ExceptionHandler
    fun handleRuntimeException(ex: RuntimeException): ResponseEntity<ApiErrorResponse> {
        val errorMessage = ApiErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            ex.localizedMessage
        )
        return ResponseEntity(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}