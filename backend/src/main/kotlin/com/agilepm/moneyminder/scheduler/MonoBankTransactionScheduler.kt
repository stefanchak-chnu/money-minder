package com.agilepm.moneyminder.scheduler

import com.agilepm.moneyminder.service.AccountService
import com.agilepm.moneyminder.service.ExchangeService
import com.agilepm.moneyminder.service.MonoBankService
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component


@Component
class MonoBankTransactionScheduler(
    private val monoBankService: MonoBankService,
    private val accountService: AccountService,
) {

    @OptIn(DelicateCoroutinesApi::class)
    @Scheduled(fixedRate = 1000 * 60 * 3)
    fun run() {
        accountService.getAllMonobankAccountsAvailableForTransactionSync().stream().forEach { projection ->
            GlobalScope.async {
                monoBankService.updateRecentTransactionsFromMono(projection.getAccount(), projection.getMonoBankToken())
            }
        }
    }
}