import {Injectable} from '@angular/core';
import {Observable, Subject, tap} from 'rxjs';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ConditionTypeEnum, Rule} from "../../models/rule";

@Injectable({
  providedIn: 'root',
})
export class RuleService {

  readonly rootUrl = environment.apiUrl + '/rules';

  private refreshRulesSubject = new Subject<void>();

  constructor(private httpClient: HttpClient) {
  }

  getRules(): Observable<Rule[]> {
    return this.httpClient.get<Rule[]>(this.rootUrl);
  }

  createRule(request: any, applyToExistingTransactions: boolean): Observable<Object> {
    return this.httpClient.post(this.rootUrl + "?applyToExistingTransactions=" + applyToExistingTransactions, request)
      .pipe(tap(() => {
          this.refreshRulesSubject.next();
        })
      );
  }

  get refreshRules$(): Observable<void> {
    return this.refreshRulesSubject.asObservable();
  }
}
