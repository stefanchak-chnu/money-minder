import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from '../../models/user';
import { Bank } from '../../models/bank';

@Injectable({
  providedIn: 'root',
})
export class BanksService {
  private readonly rootUrl = environment.apiUrl + '/banks';

  private refreshBanks = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  getBanks(): Observable<Bank[]> {
    return this.httpClient.get<Bank[]>(this.rootUrl);
  }

  get refreshBanks$(): Observable<void> {
    return this.refreshBanks.asObservable();
  }

  triggerRefreshBanks() {
    this.refreshBanks.next();
  }
}
