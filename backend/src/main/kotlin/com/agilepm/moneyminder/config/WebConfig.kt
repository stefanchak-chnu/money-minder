package com.agilepm.moneyminder.config

import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.client.RestTemplate

@EnableScheduling
@EnableCaching
@Configuration
class WebConfig {

    @Bean
    fun restTemplate(): RestTemplate {
        return RestTemplate()
    }
}