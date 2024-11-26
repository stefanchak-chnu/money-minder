import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account } from '../../../../../../models/account';
import { AccountService } from '../../../../../../services/api/account-service';
import { NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { bottomModalOpenClose } from '../../../../../../animations/bottom-modal-open-close';

@Component({
  selector: 'app-transaction-account-filter',
  standalone: true,
  imports: [NgForOf, NgIf, MatIcon],
  templateUrl: './transaction-account-filter.component.html',
  styleUrl: './transaction-account-filter.component.scss',
  animations: [bottomModalOpenClose],
})
export class TransactionAccountFilterComponent implements OnInit {
  @Input() selectedAccount: Account | undefined = undefined;
  @Input() skipBankAccounts: boolean = false;
  @Output() accountSelected = new EventEmitter<Account>();
  @Output() closed = new EventEmitter<void>();

  protected accounts: Account[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService
      .getAccounts(this.skipBankAccounts)
      .subscribe((a) => (this.accounts = a));
  }

  selectAccount(account: Account) {
    this.selectedAccount = account;
  }

  reset() {
    this.accountSelected.emit(undefined);
  }

  closeModal() {
    this.closed.emit();
  }

  apply() {
    this.accountSelected.emit(this.selectedAccount);
    this.closeModal();
  }
}
