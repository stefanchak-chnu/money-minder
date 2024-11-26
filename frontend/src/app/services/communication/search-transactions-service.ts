import {Injectable} from '@angular/core';
import {map, merge, Observable, Subject} from 'rxjs';
import {AccountType} from '../../models/account-type';
import {Transaction} from "../../models/transaction";
import {
  SearchTransactionFilters
} from "../../components/common/transaction/search-transactions/model/search-transaction-filters";

@Injectable({
  providedIn: 'root',
})
export class SearchTransactionsService {
  private openModalSource = new Subject<SearchTransactionFilters>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(filters: SearchTransactionFilters): void {
    this.openModalSource.next(filters);
  }
}
