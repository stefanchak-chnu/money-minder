import { Component } from '@angular/core';
import { LinkMonobankService } from '../../../../services/communication/link-monobank-service';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MonobankService } from '../../../../services/api/monobank-service';
import { SelectNewBankService } from '../../../../services/communication/select-new-bank-service';
import { BanksService } from '../../../../services/api/banks-service';
import { sideModalOpenClose } from '../../../../animations/side-modal-open-close';

@Component({
  selector: 'app-connect-monobank',
  standalone: true,
  imports: [NgIf, FormsModule, MatIcon, NgForOf],
  templateUrl: './connect-monobank.component.html',
  styleUrl: './connect-monobank.component.scss',
  animations: [sideModalOpenClose],
})
export class ConnectMonobankComponent {
  protected isOpened: boolean = false;
  protected token: string = '';

  constructor(
    private linkMonobankService: LinkMonobankService,
    private monoBankService: MonobankService,
    private selectNewBankService: SelectNewBankService,
    private banksService: BanksService,
  ) {
    this.linkMonobankService.modalOpened$.subscribe(() => {
      this.isOpened = true;
    });
  }

  closeModal() {
    this.isOpened = false;
  }

  connectMonoBank() {
    if (this.token === '') {
      return;
    }
    this.monoBankService.link(this.token).subscribe((response) => {
      if (response.status === 201) {
        this.closeModal();
        this.banksService.triggerRefreshBanks();
        this.selectNewBankService.closeModal();
      }
    });
  }

  onSwipeRight() {
    this.closeModal();
  }
}
