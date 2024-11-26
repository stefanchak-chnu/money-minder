import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AccountType} from '../../models/account-type';
import {Transaction} from "../../models/transaction";
import {Account} from "../../models/account";
import {TopExpense} from "../../models/top-expense";

@Injectable({
  providedIn: 'root',
})
export class ViewCategoryExpensesService {
  private openModalSource = new Subject<any>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(expense: any) {
    this.openModalSource.next(expense);
  }
}
