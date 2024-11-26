import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AccountType} from '../../models/account-type';
import {Transaction} from "../../models/transaction";
import {Account} from "../../models/account";
import {TopExpense} from "../../models/top-expense";

@Injectable({
  providedIn: 'root',
})
export class ViewSearchCategoryExpensesService {
  private openModalSource = new Subject<void>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal() {
    this.openModalSource.next();
  }
}
