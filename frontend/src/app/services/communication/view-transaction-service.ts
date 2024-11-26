import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountType } from '../../models/account-type';
import {Transaction} from "../../models/transaction";

@Injectable({
  providedIn: 'root',
})
export class ViewTransactionService {
  private openModalSource = new Subject<Transaction>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(transaction: Transaction) {
    this.openModalSource.next(transaction);
  }
}
