import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountType } from '../../models/account-type';

@Injectable({
  providedIn: 'root',
})
export class SelectBankAccountInputMethodService {
  private openModalSource = new Subject<AccountType>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(type: AccountType) {
    this.openModalSource.next(type);
  }
}
