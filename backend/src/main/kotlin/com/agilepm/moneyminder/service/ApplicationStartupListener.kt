package com.agilepm.moneyminder.service

import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component

@Component
class ApplicationStartupListener(private val exchangeService: ExchangeService) {

    @EventListener
    private fun onApplicationStarted(event: ContextRefreshedEvent) {
        // hack for initializing exchange rates cache at startup and avoid too many requests exception from monobank api
        exchangeService.fetchExchangeRates()
    }
}