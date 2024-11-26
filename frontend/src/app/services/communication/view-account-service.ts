import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AccountType} from '../../models/account-type';
import {Transaction} from "../../models/transaction";
import {Account} from "../../models/account";

@Injectable({
  providedIn: 'root',
})
export class ViewAccountService {
  private openModalSource = new Subject<Account>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(account: Account) {
    this.openModalSource.next(account);
  }
}
