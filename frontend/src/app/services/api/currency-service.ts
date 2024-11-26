import { Injectable } from '@angular/core';
import { Currency } from '../../models/currency';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  readonly rootUrl = environment.apiUrl + '/currencies';

  constructor(private httpClient: HttpClient) {}

  getCurrencies(): Observable<Currency[]> {
    return this.httpClient.get<Currency[]>(this.rootUrl);
  }
}
