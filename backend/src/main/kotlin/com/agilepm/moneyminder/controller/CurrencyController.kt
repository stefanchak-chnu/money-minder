package com.agilepm.moneyminder.controller

import com.agilepm.moneyminder.entity.Currency
import com.agilepm.moneyminder.entity.mapToResponse
import com.agilepm.moneyminder.model.response.CurrencyResponse
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/currencies")
class CurrencyController {

    @ResponseStatus(HttpStatus.OK)
    @RequestMapping
    fun getCurrencies(): List<CurrencyResponse> {
        return Currency
            .entries
            .map { a -> a.mapToResponse() }
            .toList();
    }
}