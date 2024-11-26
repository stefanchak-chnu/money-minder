import { Component } from '@angular/core';
import { ViewSearchCategoryExpensesService } from '../../../../services/communication/view-search-category-expenses-service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoaderComponent } from '../../loader/loader.component';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { TransactionComponent } from '../../transaction/transaction.component';
import { TopExpense } from '../../../../models/top-expense';
import { CategoryService } from '../../../../services/api/category-service';
import { ViewCategoryExpensesService } from '../../../../services/communication/view-category-expenses-service';
import { Category, CategoryType } from '../../../../models/category';
import { Account } from '../../../../models/account';
import {
  DateFilterOption,
  datesFilterOptions,
} from '../../../../models/date-filter-option';
import { TransactionAccountFilterComponent } from '../../transaction/search-transactions/filters/transaction-account-filter/transaction-account-filter.component';
import { TransactionDateFilterComponent } from '../../transaction/search-transactions/filters/transaction-date-filter/transaction-date-filter.component';
import { CategoriesFilterComponent } from '../categories-filter/categories-filter.component';
import { sideModalOpenClose } from '../../../../animations/side-modal-open-close';

@Component({
  selector: 'app-search-category-expenses',
  standalone: true,
  imports: [
    InfiniteScrollModule,
    LoaderComponent,
    MatIcon,
    NgForOf,
    NgIf,
    TransactionComponent,
    DecimalPipe,
    DatePipe,
    NgClass,
    TransactionAccountFilterComponent,
    TransactionDateFilterComponent,
    CategoriesFilterComponent,
  ],
  templateUrl: './search-category-expenses.component.html',
  styleUrl: './search-category-expenses.component.scss',
  animations: [sideModalOpenClose],
})
export class SearchCategoryExpensesComponent {
  protected isOpen: boolean = false;

  protected topExpenses: TopExpense[] = [];
  protected totalExpensesAmount: number = 0;
  protected totalExpenseCurrencySign: string = '$';

  protected readonly CategoryType = CategoryType;
  protected categoryType: CategoryType = CategoryType.EXPENSE;
  protected isLoading: boolean = false;

  protected areFiltersOpen: boolean = false;

  protected accountFilter: Account | undefined = undefined;
  protected isAccountFilterOpened: boolean = false;

  protected readonly datesFilterOptions = datesFilterOptions;
  protected dateFilter: DateFilterOption | undefined = datesFilterOptions[1];
  protected isDateFilterOpened: boolean = false;

  protected isCategoriesFilterOpened: boolean = false;
  protected categoriesToIgnore: string[] = [];

  constructor(
    private viewSearchCategoryExpensesService: ViewSearchCategoryExpensesService,
    private viewCategoryExpensesService: ViewCategoryExpensesService,
    private categoryService: CategoryService,
  ) {
    this.viewSearchCategoryExpensesService.modalOpened$.subscribe(() => {
      this.loadTopExpenses();
      this.isOpen = true;
    });

    if (localStorage.getItem('space')! != null) {
      this.totalExpenseCurrencySign = JSON.parse(
        localStorage.getItem('space')!,
      ).primaryCurrency.sign;
    }
  }

  private loadTopExpenses() {
    this.isLoading = true;
    this.categoryService
      .getTopExpensesByCategories(
        this.dateFilter?.dateFrom!,
        this.dateFilter?.dateTo!,
        this.categoryType,
        this.accountFilter?.id,
        this.categoriesToIgnore,
      )
      .subscribe((topExpenses) => {
        this.topExpenses = topExpenses;

        this.calculateTotalExpensesAmount(topExpenses);
        this.calculatePercentages(topExpenses);

        this.isLoading = false;
      });
  }

  private calculateTotalExpensesAmount(topExpenses: TopExpense[]) {
    this.totalExpensesAmount = topExpenses.reduce(
      (total, expense) => total + expense.total,
      0,
    );
  }

  private calculatePercentages(topExpenses: TopExpense[]) {
    topExpenses.forEach((expense) => {
      expense.percentage = (expense.total / this.totalExpensesAmount) * 100;
    });
  }

  closeModal() {
    this.isOpen = false;
  }

  openCategoryTransactionsView(topExpense: TopExpense) {
    this.viewCategoryExpensesService.openModal({
      topExpense: topExpense,
      dateFrom: this.dateFilter?.dateFrom!,
      dateTo: this.dateFilter?.dateTo!,
    });
  }

  changeCategoriesType() {
    this.categoryType =
      this.categoryType === CategoryType.EXPENSE
        ? CategoryType.INCOME
        : CategoryType.EXPENSE;
    this.loadTopExpenses();
  }

  openCloseFilters() {
    this.areFiltersOpen = !this.areFiltersOpen;
  }

  resetFilters() {
    this.dateFilter = datesFilterOptions[1];
    this.accountFilter = undefined;
    this.categoriesToIgnore = [];
    this.loadTopExpenses();
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
    this.loadTopExpenses();
    this.isAccountFilterOpened = false;
  }

  onDateSelected(dateFilter: DateFilterOption) {
    this.dateFilter = dateFilter;
    this.loadTopExpenses();
    this.isDateFilterOpened = false;
  }

  openCategoriesFilter() {
    this.isCategoriesFilterOpened = true;
  }

  onCategoriesUnselected(unselectedCategories: string[]) {
    this.isCategoriesFilterOpened = false;
    this.categoriesToIgnore = unselectedCategories;
    this.loadTopExpenses();
  }

  onSwipeRight() {
    this.closeModal();
  }
}
