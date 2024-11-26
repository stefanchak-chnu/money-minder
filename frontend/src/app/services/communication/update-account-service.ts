import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountType } from '../../models/account-type';
import { Account } from '../../models/account';

@Injectable({
  providedIn: 'root',
})
export class UpdateAccountService {
  private openModalSource = new Subject<Account>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(account: Account) {
    this.openModalSource.next(account);
  }
}
