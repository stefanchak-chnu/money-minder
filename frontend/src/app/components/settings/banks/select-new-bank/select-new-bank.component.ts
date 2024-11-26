import { Component } from '@angular/core';
import { SelectNewBankService } from '../../../../services/communication/select-new-bank-service';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankType } from '../../../../models/bank-type';
import { LinkMonobankService } from '../../../../services/communication/link-monobank-service';
import { ConnectMonobankComponent } from '../connect-monobank/connect-monobank.component';
import { sideModalOpenClose } from '../../../../animations/side-modal-open-close';

@Component({
  selector: 'app-select-new-bank',
  standalone: true,
  imports: [MatIcon, NgIf, FormsModule, NgForOf, ConnectMonobankComponent],
  templateUrl: './select-new-bank.component.html',
  styleUrl: './select-new-bank.component.scss',
  animations: [sideModalOpenClose],
})
export class SelectNewBankComponent {
  protected isOpened: boolean = false;
  protected bankOptions: BankType[] = [BankType.MONOBANK];
  protected selectedBank: BankType = BankType.MONOBANK;

  constructor(
    private selectNewBankService: SelectNewBankService,
    private linkMonobankService: LinkMonobankService,
  ) {
    this.selectNewBankService.modalOpened$.subscribe((flag) => {
      this.isOpened = flag;
    });
  }

  closeModal() {
    this.isOpened = false;
  }

  selectBank() {
    if (this.selectedBank === BankType.MONOBANK) {
      this.linkMonobankService.openModal();
    }
  }

  onSwipeRight() {
    this.closeModal()
  }
}
