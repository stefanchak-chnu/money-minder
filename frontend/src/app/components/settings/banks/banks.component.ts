import { Component, HostListener } from '@angular/core';
import { LoaderComponent } from '../../common/loader/loader.component';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { ViewBanksService } from '../../../services/communication/view-banks-service';
import { SelectNewBankService } from '../../../services/communication/select-new-bank-service';
import { SelectNewBankComponent } from './select-new-bank/select-new-bank.component';
import { BanksService } from '../../../services/api/banks-service';
import { Bank } from '../../../models/bank';
import { LinkMonobankAccountService } from '../../../services/communication/link-monobank-account-service';
import { BankType } from '../../../models/bank-type';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [LoaderComponent, MatIcon, NgForOf, NgIf, SelectNewBankComponent],
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.scss',
  animations: [sideModalOpenClose],
})
export class BanksComponent {
  protected isOpened: boolean = false;
  protected banks: Bank[] = [];
  protected shouldLinkAccount: boolean = false;

  constructor(
    private viewBanksService: ViewBanksService,
    private selectNewBankService: SelectNewBankService,
    private bankService: BanksService,
    private linkMonobankAccountService: LinkMonobankAccountService,
  ) {
    this.viewBanksService.modalOpened$.subscribe((shouldLinkAccount) => {
      this.shouldLinkAccount = shouldLinkAccount;
      this.getBanks();
      this.isOpened = true;
    });
    this.bankService.refreshBanks$.subscribe(() => {
      this.getBanks();
    });
  }

  private getBanks() {
    this.bankService.getBanks().subscribe((banks) => (this.banks = banks));
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.closeModal();
  }

  closeModal() {
    this.isOpened = false;
  }

  openConnectBankModal() {
    this.selectNewBankService.openModal();
  }

  openViewBankModal(bank: Bank) {
    if (bank.type == BankType.MONOBANK) {
      if (this.shouldLinkAccount) {
        this.linkMonobankAccountService.openModal();
        this.closeModal();
      } else {
        // todo: view linked mono accounts
      }
    }
  }

  onSwipeRight() {
    this.closeModal()
  }
}
