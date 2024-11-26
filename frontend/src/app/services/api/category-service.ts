import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Category, CategoryType } from '../../models/category';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TopExpense } from '../../models/top-expense';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly rootUrl = environment.apiUrl + '/categories';

  private refreshTopExpensesSubject = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  getCategories(type?: CategoryType): Observable<Category[]> {
    let path = this.rootUrl;
    if (type) {
      path = path + '?type=' + type;
    }
    return this.httpClient.get<Category[]>(path);
  }

  getTopExpensesByCategories(
    dateFrom: Date,
    dateTo: Date,
    categoryType?: CategoryType,
    accountId?: string,
    categoryIdsToExclude?: string[],
  ): Observable<TopExpense[]> {
    let path = this.rootUrl + '/top-expenses?';
    dateFrom.setUTCHours(0, 0, 0, 0);
    dateTo.setUTCHours(23, 59, 59, 0);
    path = path + '&dateFrom=' + dateFrom.toISOString().slice(0, -1);
    path = path + '&dateTo=' + dateTo.toISOString().slice(0, -1);

    if (categoryIdsToExclude) {
      path = path + '&categoryIdsToExclude=' + categoryIdsToExclude.join(',');
    }
    if (categoryType) {
      path = path + '&categoryType=' + categoryType;
    }
    if (accountId) {
      path = path + '&accountId=' + accountId;
    }

    return this.httpClient.get<TopExpense[]>(path);
  }

  refreshTopExpenses() {
    this.refreshTopExpensesSubject.next();
  }

  get refreshTopExpenses$(): Observable<void> {
    return this.refreshTopExpensesSubject.asObservable();
  }
}
