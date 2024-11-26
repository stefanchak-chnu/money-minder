import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly rootUrl = environment.apiUrl + '/users/current';

  constructor(private httpClient: HttpClient) {}

  getUser(): Observable<User> {
    return this.httpClient.get<User>(this.rootUrl);
  }
}
