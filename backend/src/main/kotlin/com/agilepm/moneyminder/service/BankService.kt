package com.agilepm.moneyminder.service

import com.agilepm.moneyminder.model.response.BankResponse
import com.agilepm.moneyminder.repository.MonoBankInfoRepository
import java.util.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class BankService(private val monoBankInfoRepository: MonoBankInfoRepository) {

    @Transactional(readOnly = true)
    fun getBanks(spaceId: UUID): List<BankResponse> {
        val bankResponses = mutableListOf<BankResponse>()

        monoBankInfoRepository.findBySpaceId(spaceId).ifPresent { it ->
            bankResponses.add(
                BankResponse(
                    id = it.id,
                    name = "Monobank",
                    type = BankResponse.BankType.MONOBANK
                )
            )
        }
        return bankResponses.toList()
    }
}