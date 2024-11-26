import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountType } from '../../models/account-type';

@Injectable({
  providedIn: 'root',
})
export class CreateAccountService {
  private openModalSource = new Subject<AccountType>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(opened: AccountType) {
    this.openModalSource.next(opened);
  }
}
