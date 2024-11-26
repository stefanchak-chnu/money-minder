import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/api/transaction-service';
import { DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { TransactionComponent } from '../common/transaction/transaction.component';
import { SearchTransactionsService } from '../../services/communication/search-transactions-service';
import { LoaderComponent } from '../common/loader/loader.component';
import { CreateTransactionButtonComponent } from '../common/transaction/create-transaction-button/create-transaction-button.component';
import { TopExpensesWidgetComponent } from '../common/widgets/top-expenses-widget/top-expenses-widget.component';
import { NavComponent } from '../common/nav/nav.component';
import { HeaderComponent } from '../common/header/header.component';
import { CategoryExpensesComponent } from '../common/categories/category-expenses/category-expenses.component';
import { CategoriesComponent } from '../common/categories/categories.component';
import { CreateTransactionComponent } from '../common/transaction/create-transaction/create-transaction.component';
import { SearchTransactionsComponent } from '../common/transaction/search-transactions/search-transactions.component';
import { TransactionViewComponent } from '../common/transaction/transaction-view/transaction-view.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIcon,
    NgForOf,
    DatePipe,
    DecimalPipe,
    TransactionComponent,
    LoaderComponent,
    NgIf,
    CreateTransactionButtonComponent,
    TopExpensesWidgetComponent,
    NavComponent,
    HeaderComponent,
    CategoryExpensesComponent,
    CategoriesComponent,
    CreateTransactionComponent,
    SearchTransactionsComponent,
    TransactionViewComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  protected transactions: Transaction[] = [];
  protected isLoading: boolean = false;

  constructor(
    private transactionService: TransactionService,
    private searchTransactionService: SearchTransactionsService,
  ) {
    this.isLoading = true;
    this.loadTransactions();
    this.transactionService.refreshTransactions$.subscribe(() =>
      this.loadTransactions(),
    );
  }

  private loadTransactions() {
    this.transactionService.getLastTransactions(5).subscribe((pageResponse) => {
      this.transactions = pageResponse.content;
      this.isLoading = false;
    });
  }

  openSearchTransactionsModal() {
    this.searchTransactionService.openModal({});
  }
}
