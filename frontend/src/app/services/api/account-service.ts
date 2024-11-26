import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Account } from '../../models/account';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AccountType } from '../../models/account-type';
import { NetWorth } from '../../models/net-worth';
import { TypeGroupedAccounts } from '../../models/typeGroupedAccounts';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly rootUrl = environment.apiUrl + '/accounts';

  private newAccountSubject = new Subject<void>();
  private updatedAccountSubject = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  getTypeGroupedAccounts(): Observable<TypeGroupedAccounts[]> {
    return this.httpClient.get<TypeGroupedAccounts[]>(
      this.rootUrl + '/type-grouped',
    );
  }

  getAccounts(skipBankAccounts: boolean = false): Observable<Account[]> {
    return this.httpClient.get<Account[]>(
      this.rootUrl + '?skipBankAccounts=' + skipBankAccounts,
    );
  }

  getAccount(accountId: string): Observable<Account> {
    return this.httpClient.get<Account>(this.rootUrl + '/' + accountId);
  }

  getDefaultAccount(): Observable<Account> {
    return this.httpClient.get<Account>(this.rootUrl + '/default');
  }

  getNetWorth(): Observable<NetWorth> {
    return this.httpClient.get<NetWorth>(this.rootUrl + '/net-worth');
  }

  updateDefaultAccount(account: Account): Observable<void> {
    return this.httpClient.put<void>(
      this.rootUrl + '/default' + '?accountId=' + account.id,
      {},
    );
  }

  getAccountTypes(): Observable<AccountType[]> {
    return this.httpClient.get<AccountType[]>(this.rootUrl + '/types');
  }

  createAccount(accountRequest: any): Observable<any> {
    return this.httpClient.post(this.rootUrl, accountRequest).pipe(
      tap(() => {
        this.newAccountSubject.next();
      }),
    );
  }

  updateAccount(accountId: string, accountRequest: any): Observable<any> {
    return this.httpClient
      .put(this.rootUrl + '/' + accountId, accountRequest)
      .pipe(
        tap(() => {
          this.updatedAccountSubject.next();
        }),
      );
  }

  refreshAccounts(): void {
    this.newAccountSubject.next();
  }

  get newAccount$(): Observable<void> {
    return this.newAccountSubject.asObservable();
  }

  get updatedAccount$(): Observable<void> {
    return this.updatedAccountSubject.asObservable();
  }
}
