package com.agilepm.moneyminder.service

import com.agilepm.moneyminder.model.response.MonoBankExchangeRateResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.cache.annotation.Cacheable
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange

@Service
class ExchangeService(
    private val restTemplate: RestTemplate,
    @Value("\${monobank.api.url}") private val monoBankUrl: String
) {

    private val logger = LoggerFactory.getLogger(ExchangeService::class.java)

    @Cacheable("exchangeRates", unless = "#result.isEmpty()")
    fun fetchExchangeRates(): List<MonoBankExchangeRateResponse> {
        logger.info("Fetching exchange rates from MonoBank...")
        val uri = "$monoBankUrl/bank/currency";
        try {
            val response = restTemplate.exchange<List<MonoBankExchangeRateResponse>>(
                uri,
                HttpMethod.GET
            )
            return response.body ?: listOf()
        } catch (ex: Exception) {
            logger.error(ex.localizedMessage)
            return listOf()
        }
    }
}
