package com.agilepm.moneyminder.controller

import com.agilepm.moneyminder.model.request.RuleRequest
import com.agilepm.moneyminder.model.response.RuleResponse
import com.agilepm.moneyminder.service.RuleService
import com.agilepm.moneyminder.util.SecurityUtil
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/rules")
class RuleController(private val ruleService: RuleService) {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    fun getAllRules(): List<RuleResponse> {
        return ruleService.getAllRulesForSpace(SecurityUtil.getCurrentUserSpaceId())
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun createRule(
        @RequestBody ruleRequest: RuleRequest,
        @RequestParam applyToExistingTransactions: Boolean?
    ): RuleResponse {
        return ruleService.createRule(
            SecurityUtil.getCurrentUserSpaceId(),
            ruleRequest,
            applyToExistingTransactions ?: false
        )
    }
}
