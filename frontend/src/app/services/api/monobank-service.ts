import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../../models/user';
import { MonobankAccount } from '../../models/monobank-account';

@Injectable({
  providedIn: 'root',
})
export class MonobankService {
  private readonly rootUrl = environment.apiUrl + '/mono';

  constructor(private httpClient: HttpClient) {}

  link(token: String): Observable<HttpResponse<void>> {
    return this.httpClient.post<any>(
      this.rootUrl + '/link?clientToken=' + token,
      {},
      { observe: 'response' },
    );
  }

  linkAccount(request: any): Observable<HttpResponse<void>> {
    return this.httpClient.post<any>(this.rootUrl + '/accounts/link', request, {
      observe: 'response',
    });
  }

  getMonoBankAccounts(): Observable<MonobankAccount[]> {
    return this.httpClient.get<MonobankAccount[]>(this.rootUrl + '/accounts');
  }

  refreshMonoBankTransactions(): Observable<HttpResponse<void>> {
    return this.httpClient.get<HttpResponse<void>>(
      this.rootUrl + '/accounts/refresh',
    );
  }
}
