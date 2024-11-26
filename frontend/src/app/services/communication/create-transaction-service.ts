import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountType } from '../../models/account-type';
import { Account } from '../../models/account';

@Injectable({
  providedIn: 'root',
})
export class CreateTransactionService {
  private openModalSource = new Subject<Account | undefined>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(account?: Account | undefined) {
    this.openModalSource.next(account);
  }
}
