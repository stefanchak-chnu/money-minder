package com.agilepm.moneyminder.controller

import com.agilepm.moneyminder.model.response.BankResponse
import com.agilepm.moneyminder.service.BankService
import com.agilepm.moneyminder.util.SecurityUtil
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/banks")
class BankController(private val bankService: BankService) {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    fun getConnectedBanks(): List<BankResponse> {
        return bankService.getBanks(SecurityUtil.getCurrentUserSpaceId())
    }
}
