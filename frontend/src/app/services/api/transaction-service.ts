import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Transaction } from '../../models/transaction';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PageResponse } from '../../models/page-response';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  readonly rootUrl = environment.apiUrl + '/transactions';

  private refreshTransactionsSubject = new Subject<void>();
  private refreshAccountBalanceSubject = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  getLastTransactions(size: number): Observable<PageResponse<Transaction>> {
    return this.httpClient.get<PageResponse<Transaction>>(
      this.rootUrl + '/search?size=' + size,
    );
  }

  searchTransactions(
    page: number,
    size: number,
    searchQuery: string,
    accountId?: string,
    categoryId?: string,
    needReview?: boolean,
    dateFrom?: Date,
    dateTo?: Date,
  ): Observable<PageResponse<Transaction>> {
    let path = '/search?size=' + size + '&page=' + page;

    if (searchQuery) {
      path = path + '&name=' + searchQuery + '&notes=' + searchQuery;
    }
    if (accountId) {
      path = path + '&accountId=' + accountId;
    }
    if (categoryId) {
      path = path + '&categoryId=' + categoryId;
    }
    if (needReview) {
      path = path + '&needReview=' + needReview;
    }
    if (dateFrom) {
      dateFrom.setUTCHours(0, 0, 0, 0);
      path = path + '&dateFrom=' + dateFrom.toISOString().slice(0, -1);
    }
    if (dateTo) {
      dateTo.setUTCHours(23, 59, 59, 0);
      path = path + '&dateTo=' + dateTo.toISOString().slice(0, -1);
    }

    return this.httpClient.get<PageResponse<Transaction>>(this.rootUrl + path);
  }

  create(createRequest: any): Observable<Transaction> {
    return this.httpClient.post<Transaction>(this.rootUrl, createRequest).pipe(
      tap(() => {
        this.refreshTransactionsSubject.next();
        this.refreshAccountBalanceSubject.next();
      }),
    );
  }

  update(id: string, updateRequest: any): Observable<Transaction> {
    return this.httpClient
      .put<Transaction>(this.rootUrl + '/' + id, updateRequest)
      .pipe(
        tap(() => {
          this.refreshAccountBalanceSubject.next();
        }),
      );
  }

  delete(transaction: Transaction) {
    return this.httpClient.delete(this.rootUrl + '/' + transaction.id).pipe(
      tap(() => {
        this.refreshTransactionsSubject.next();
        this.refreshAccountBalanceSubject.next();
      }),
    );
  }

  refreshTransactions() {
    this.refreshTransactionsSubject.next();
  }

  get refreshTransactions$(): Observable<void> {
    return this.refreshTransactionsSubject.asObservable();
  }

  get refreshAccountBalance$(): Observable<void> {
    return this.refreshAccountBalanceSubject.asObservable();
  }
}
