package com.agilepm.moneyminder.controller

import com.agilepm.moneyminder.model.request.CreateTransactionRequest
import com.agilepm.moneyminder.model.request.TransactionSearchRequest
import com.agilepm.moneyminder.model.request.UpdateTransactionRequest
import com.agilepm.moneyminder.model.response.PageResponse
import com.agilepm.moneyminder.model.response.TransactionResponse
import com.agilepm.moneyminder.service.TransactionService
import com.agilepm.moneyminder.util.SecurityUtil
import java.time.LocalDateTime
import java.util.*
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/transactions")
class TransactionController(private var transactionService: TransactionService) {

    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/search")
    fun searchTransactions(
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) notes: String?,
        @RequestParam(required = false) accountId: UUID?,
        @RequestParam(required = false) categoryId: UUID?,
        @RequestParam(required = false) needReview: Boolean?,
        @RequestParam(required = false) dateFrom: LocalDateTime?,
        @RequestParam(required = false) dateTo: LocalDateTime?,
        @RequestParam(required = false) page: Int?,
        @RequestParam(required = false) size: Int?
    ): PageResponse<TransactionResponse> {
        val transactionSearchRequest = TransactionSearchRequest(
            name,
            notes,
            accountId,
            categoryId,
            needReview,
            dateFrom,
            dateTo,
            page,
            size
        )
        return transactionService.searchTransactions(SecurityUtil.getCurrentUserSpaceId(), transactionSearchRequest)
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    fun createTransaction(@RequestBody transactionRequest: CreateTransactionRequest): TransactionResponse {
        return transactionService.createTransaction(SecurityUtil.getCurrentUserSpaceId(), transactionRequest)
    }

    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{id}")
    fun updateTransaction(@PathVariable("id") id: UUID, @RequestBody transactionRequest: UpdateTransactionRequest): TransactionResponse {
       return transactionService.updateTransaction(id, transactionRequest)
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    fun deleteTransaction(@PathVariable("id") id: UUID) {
        transactionService.deleteTransaction(id)
    }

}
