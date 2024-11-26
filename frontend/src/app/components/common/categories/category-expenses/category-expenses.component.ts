import { Component, OnInit } from '@angular/core';
import { CreateTransactionButtonComponent } from '../../transaction/create-transaction-button/create-transaction-button.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoaderComponent } from '../../loader/loader.component';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { TransactionComponent } from '../../transaction/transaction.component';
import { Transaction } from '../../../../models/transaction';
import { SearchTransactionsService } from '../../../../services/communication/search-transactions-service';
import { TransactionService } from '../../../../services/api/transaction-service';
import { ViewCategoryExpensesService } from '../../../../services/communication/view-category-expenses-service';
import { TopExpense } from '../../../../models/top-expense';
import { sideModalOpenClose } from '../../../../animations/side-modal-open-close';

@Component({
  selector: 'app-category-expenses',
  standalone: true,
  imports: [
    CreateTransactionButtonComponent,
    InfiniteScrollModule,
    LoaderComponent,
    MatIcon,
    NgForOf,
    NgIf,
    TransactionComponent,
  ],
  templateUrl: './category-expenses.component.html',
  styleUrl: './category-expenses.component.scss',
  animations: [sideModalOpenClose],
})
export class CategoryExpensesComponent implements OnInit {
  protected isOpen: boolean = false;

  protected transactions: Transaction[] = [];
  protected currentPage: number = 0;
  protected itemsPerPage: number = 20;
  protected hasMoreTransactions: boolean = true;
  protected isLoading: boolean = true;
  protected topExpense: TopExpense | undefined;
  protected dateFrom: Date | undefined = undefined;
  protected dateTo: Date | undefined = undefined;
  protected totalExpenseCurrencySign: string = '$';

  constructor(
    private viewCategoryExpensesService: ViewCategoryExpensesService,
    private searchTransactionsService: SearchTransactionsService,
    private transactionService: TransactionService,
  ) {}

  ngOnInit(): void {
    this.viewCategoryExpensesService.modalOpened$.subscribe((object) => {
      this.topExpense = object.topExpense;
      this.dateFrom = object.dateFrom;
      this.dateTo = object.dateTo;

      this.openModal();
      this.loadTransactions();
    });
    this.totalExpenseCurrencySign = JSON.parse(
      localStorage.getItem('space')!,
    )?.primaryCurrency?.sign;
  }

  private loadTransactions() {
    this.isLoading = true;

    this.transactionService
      .searchTransactions(
        this.currentPage,
        this.itemsPerPage,
        '',
        undefined,
        this.topExpense?.category?.id,
        !this.topExpense?.category,
        this.dateFrom,
        this.dateTo,
      )
      .subscribe((pageResponse) => {
        this.transactions = this.transactions.concat(pageResponse.content);
        this.hasMoreTransactions = !pageResponse.last;
        this.isLoading = false;
      });
  }

  private openModal() {
    this.transactions = [];
    this.isOpen = true;
    this.currentPage = 0;
  }

  closeModal() {
    this.isOpen = false;
  }

  openSearch() {
    this.searchTransactionsService.openModal({
      category: this.topExpense?.category,
    });
  }

  loadMore() {
    if (this.hasMoreTransactions) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  onSwipeRight() {
    this.closeModal();
  }
}
