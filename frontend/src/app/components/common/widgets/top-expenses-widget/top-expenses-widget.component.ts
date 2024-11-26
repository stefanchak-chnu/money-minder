import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CategoryService } from '../../../../services/api/category-service';
import { TopExpense } from '../../../../models/top-expense';
import { MatIcon } from '@angular/material/icon';
import { ViewCategoryExpensesService } from '../../../../services/communication/view-category-expenses-service';
import { ViewSearchCategoryExpensesService } from '../../../../services/communication/view-search-category-expenses-service';
import {Category, CategoryType} from '../../../../models/category';
import { EditTopExpensesWidgetService } from '../../../../services/communication/edit-top-expenses-widget-service';

@Component({
  selector: 'app-top-expenses-widget',
  standalone: true,
  imports: [DatePipe, NgForOf, NgApexchartsModule, MatIcon, DecimalPipe, NgIf],
  templateUrl: './top-expenses-widget.component.html',
  styleUrls: ['./top-expenses-widget.component.scss'],
})
export class TopExpensesWidgetComponent implements OnInit {
  protected readonly currentDate: Date = new Date();

  protected topExpenses: TopExpense[] = [];
  protected topExpensesWithoutHidden: TopExpense[] = [];
  protected moreExpense: TopExpense | undefined = undefined;
  protected totalExpensesAmount: number = 0;
  protected totalExpenseCurrencySign: string = '$';

  protected dateFrom: Date;
  protected dateTo: Date;

  protected hiddenCategories: string[] = [];
  protected isEditView: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private viewCategoryExpensesService: ViewCategoryExpensesService,
    private viewSearchCategoryExpensesService: ViewSearchCategoryExpensesService,
    private editTopExpensesWidgetService: EditTopExpensesWidgetService,
  ) {
    const date = new Date();
    this.dateFrom = new Date(date.getFullYear(), date.getMonth(), 2);
    this.dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  }

  ngOnInit(): void {
    this.totalExpenseCurrencySign = JSON.parse(localStorage.getItem('space')!)?.primaryCurrency?.sign
    this.loadTopExpensesWithoutHidden();
    this.categoryService.refreshTopExpenses$.subscribe(() => {
      this.loadTopExpensesWithoutHidden();
    });
    this.editTopExpensesWidgetService.modalOpened$.subscribe(() => {
      this.openEditView();
    });
  }

  private loadTopExpensesWithoutHidden() {
    this.hiddenCategories =
      JSON.parse(localStorage.getItem('hiddenCategories')!) || [];

    this.categoryService
      .getTopExpensesByCategories(
        this.dateFrom,
        this.dateTo,
        undefined,
        undefined,
        this.hiddenCategories,
      )
      .subscribe((topExpenses) => {
        this.topExpensesWithoutHidden = topExpenses;

        this.calculateTotalExpensesAmount(this.topExpensesWithoutHidden);
        this.calculatePercentages(this.topExpensesWithoutHidden);

        if (this.topExpensesWithoutHidden.length > 12) {
          this.initMoreExpenses();
        }
      });
  }

  private loadTopExpenses() {
    this.categoryService
      .getTopExpensesByCategories(this.dateFrom, this.dateTo)
      .subscribe((topExpenses) => {
        this.topExpenses = topExpenses;

        this.calculateTotalExpensesAmount(topExpenses);
        this.calculatePercentages(topExpenses);
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

  private initMoreExpenses() {
    const remainingExpenses = this.topExpensesWithoutHidden.slice(12);
    const remainingTotal = remainingExpenses.reduce(
      (total, expense) => total + expense.total,
      0,
    );
    const remainingPercentage =
      (remainingTotal / this.totalExpensesAmount) * 100;

    this.moreExpense = {
      category: undefined,
      total: remainingTotal,
      percentage: remainingPercentage
    };
  }

  openCategoryExpensesPage(topExpense: TopExpense) {
    this.viewCategoryExpensesService.openModal({
      topExpense: topExpense,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
    });
  }

  openSearchTopExpenses() {
    this.viewSearchCategoryExpensesService.openModal();
  }

  saveUnchecked($event: MouseEvent) {
    $event.stopPropagation();

    localStorage.setItem(
      'hiddenCategories',
      JSON.stringify(this.hiddenCategories),
    );

    this.loadTopExpensesWithoutHidden();
    this.isEditView = false;
  }

  uncheckCategory($event: MouseEvent, category: Category | undefined) {
    $event.stopPropagation();

    if (category?.id) {
      const checkbox = $event.target as HTMLInputElement;
      if (checkbox.checked) {
        const index = this.hiddenCategories.indexOf(category?.id);
        if (index !== -1) {
          this.hiddenCategories.splice(index, 1);
        }
      } else {
        this.hiddenCategories.push(category?.id);
      }
    }
  }

  openEditView() {
    this.loadTopExpenses();
    this.isEditView = true;
  }

  protected readonly CategoryType = CategoryType;
}
