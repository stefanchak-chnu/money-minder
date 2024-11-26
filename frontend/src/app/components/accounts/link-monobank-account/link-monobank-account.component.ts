import { Component } from '@angular/core';
import { LinkMonobankAccountService } from '../../../services/communication/link-monobank-account-service';
import { MonobankService } from '../../../services/api/monobank-service';
import { NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MonobankAccount } from '../../../models/monobank-account';
import { LoaderComponent } from '../../common/loader/loader.component';
import { MonobankAccountCardComponent } from '../../common/banks/accounts/monobank-account-card/monobank-account-card.component';
import { AccountService } from '../../../services/api/account-service';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';

@Component({
  selector: 'app-link-monobank-account',
  standalone: true,
  imports: [
    NgIf,
    MatIcon,
    NgForOf,
    LoaderComponent,
    MonobankAccountCardComponent,
  ],
  templateUrl: './link-monobank-account.component.html',
  styleUrl: './link-monobank-account.component.scss',
  animations: [sideModalOpenClose],
})
export class LinkMonobankAccountComponent {
  protected isOpened: boolean = false;
  protected isLoading: boolean = false;
  protected monobankAccounts: MonobankAccount[] = [];

  constructor(
    private linkMonobankAccountService: LinkMonobankAccountService,
    private monobankAccountService: MonobankService,
    private accountService: AccountService,
  ) {
    this.isLoading = true;
    this.linkMonobankAccountService.modalOpened$.subscribe(() => {
      this.isOpened = true;
      this.monobankAccountService
        .getMonoBankAccounts()
        .subscribe((accounts) => {
          this.isLoading = false;
          this.monobankAccounts = accounts.filter((a) => !a.isLinked);
        });
    });
  }

  closeModal() {
    this.isOpened = false;
    this.monobankAccounts = [];
  }

  linkAccount(account: MonobankAccount) {
    this.monobankAccountService
      .linkAccount({
        id: account.id,
        type: account.type,
        balance: account.balance,
        currencyCode: account.currency.code,
        maskedPan: account.maskedPan,
        iban: account.iban,
      })
      .subscribe((response) => {
        if (response.status == 201) {
          this.closeModal();
          this.accountService.refreshAccounts();
        }
      });
  }

  onSwipeRight() {
    this.closeModal();
  }
}
