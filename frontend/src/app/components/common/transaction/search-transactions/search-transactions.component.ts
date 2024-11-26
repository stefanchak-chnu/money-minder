import { Component, HostListener, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SearchTransactionsService } from '../../../../services/communication/search-transactions-service';
import { TransactionComponent } from '../transaction.component';
import { Transaction } from '../../../../models/transaction';
import { TransactionService } from '../../../../services/api/transaction-service';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoaderComponent } from '../../loader/loader.component';
import { SearchTransactionFilters } from './model/search-transaction-filters';
import { Account } from '../../../../models/account';
import { TransactionAccountFilterComponent } from './filters/transaction-account-filter/transaction-account-filter.component';
import { TransactionDateFilterComponent } from './filters/transaction-date-filter/transaction-date-filter.component';
import {
  DateFilterOption,
  datesFilterOptions,
} from '../../../../models/date-filter-option';
import { CreateTransactionButtonComponent } from '../create-transaction-button/create-transaction-button.component';
import { Category } from '../../../../models/category';
import { sideModalOpenClose } from '../../../../animations/side-modal-open-close';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-transactions',
  standalone: true,
  imports: [
    NgIf,
    MatIcon,
    TransactionComponent,
    NgForOf,
    FormsModule,
    InfiniteScrollModule,
    LoaderComponent,
    NgClass,
    TransactionAccountFilterComponent,
    TransactionDateFilterComponent,
    CreateTransactionButtonComponent,
  ],
  templateUrl: './search-transactions.component.html',
  styleUrl: './search-transactions.component.scss',
  animations: [sideModalOpenClose],
})
export class SearchTransactionsComponent implements OnInit {
  protected isOpened: boolean = false;

  protected transactions: Transaction[] = [];

  // pagination
  protected currentPage: number = 0;
  protected itemsPerPage: number = 20;
  protected hasMoreTransactions: boolean = true;
  protected isLoading: boolean = true;

  // search
  protected searchQuery: string = '';

  // filters
  protected accountFilter: Account | undefined = undefined;
  protected isAccountFilterOpened: boolean = false;

  protected dateFilter: any = datesFilterOptions[0];
  protected isDateFilterOpened: boolean = false;

  protected categoryFilter: Category | undefined = undefined;
  protected isCategoryFilterOpened: boolean = false;

  protected needReviewFilter: boolean = false;

  protected refreshTransactionsSubscription: Subscription | undefined = undefined;

  constructor(
    private searchTransactionsService: SearchTransactionsService,
    private transactionService: TransactionService,
  ) {}

  ngOnInit(): void {
    this.searchTransactionsService.modalOpened$.subscribe((filters) => {
      this.showModal(filters);

      this.refreshTransactionsSubscription =
        this.transactionService.refreshTransactions$.subscribe(() => {
          this.currentPage = 0;
          this.loadTransactions(true);
        });
    });
  }

  private showModal(filters: SearchTransactionFilters) {
    this.accountFilter = filters.account;
    this.categoryFilter = filters.category;
    this.needReviewFilter = false;
    this.dateFilter = null;
    this.searchQuery = '';
    this.isOpened = true;
    this.currentPage = 0;
    this.loadTransactions(true);
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.closeModal();
  }

  closeModal() {
    this.isOpened = false;
    this.currentPage = 0;
    this.refreshTransactionsSubscription?.unsubscribe();
  }

  private loadTransactions(isSearch: boolean = false) {
    this.isLoading = true;
    if (isSearch) {
      this.transactions = [];
    }

    this.transactionService
      .searchTransactions(
        this.currentPage,
        this.itemsPerPage,
        this.searchQuery,
        this.accountFilter?.id,
        this.categoryFilter?.id,
        this.needReviewFilter,
        this.dateFilter?.dateFrom,
        this.dateFilter?.dateTo,
      )
      .subscribe((pageResponse) => {
        this.transactions = isSearch
          ? pageResponse.content
          : this.transactions.concat(pageResponse.content);
        this.hasMoreTransactions = !pageResponse.last;
        this.isLoading = false;
      });
  }

  search(): void {
    this.loadTransactions(true);
    this.currentPage = 0;
  }

  loadMore() {
    if (this.hasMoreTransactions) {
      this.currentPage++;
      this.loadTransactions(false);
    }
  }

  openAccountFilter() {
    this.isAccountFilterOpened = true;
  }

  closeAccountFilter() {
    this.isAccountFilterOpened = false;
  }

  openDateFilter() {
    this.isDateFilterOpened = true;
  }

  closeDateFilter() {
    this.isDateFilterOpened = false;
  }

  onAccountSelected(account: Account) {
    this.accountFilter = account;
    this.currentPage = 0;
    this.isAccountFilterOpened = false;
    this.loadTransactions(true);
  }

  onDateSelected(dateFilter: DateFilterOption) {
    this.dateFilter = dateFilter;
    this.currentPage = 0;
    this.isDateFilterOpened = false;
    this.loadTransactions(true);
  }

  applyNeedReviewFilter() {
    this.needReviewFilter = !this.needReviewFilter;
    this.currentPage = 0;
    this.loadTransactions(true);
  }

  resetFilters() {
    this.dateFilter = undefined;
    this.accountFilter = undefined;
    this.needReviewFilter = false;
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadTransactions(true);
  }

  protected readonly datesFilterOptions = datesFilterOptions;

  openCategoryFilter() {
    // implement
  }

  onSwipeRight() {
    this.closeModal();
  }
}
