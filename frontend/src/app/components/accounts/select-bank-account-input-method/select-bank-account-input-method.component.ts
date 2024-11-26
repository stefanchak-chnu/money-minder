import { Component } from '@angular/core';
import { SelectBankAccountInputMethodService } from '../../../services/communication/select-bank-account-input-method-service';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { CreateAccountService } from '../../../services/communication/create-account-service';
import { AccountType } from '../../../models/account-type';
import { ViewBanksService } from '../../../services/communication/view-banks-service';
import { bottomModalOpenClose } from '../../../animations/bottom-modal-open-close';

@Component({
  selector: 'app-select-bank-account-input-method',
  standalone: true,
  imports: [MatIcon, NgForOf, NgIf],
  templateUrl: './select-bank-account-input-method.component.html',
  styleUrl: './select-bank-account-input-method.component.scss',
  animations: [bottomModalOpenClose],
})
export class SelectBankAccountInputMethodComponent {
  protected isOpened: boolean = false;
  private type: AccountType | undefined = undefined;

  constructor(
    private selectBankAccountInputMethodService: SelectBankAccountInputMethodService,
    private createAccountService: CreateAccountService,
    private viewBanksService: ViewBanksService,
  ) {
    this.selectBankAccountInputMethodService.modalOpened$.subscribe((type) => {
      this.isOpened = true;
      this.type = type;
    });
  }

  closeModal() {
    this.isOpened = false;
  }

  openAutomaticSyncModal() {
    this.viewBanksService.openModal(true);
    this.closeModal();
  }

  openManualInputModal() {
    this.createAccountService.openModal(this.type!);
    this.closeModal();
  }
}
