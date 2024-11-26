import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountType } from '../../models/account-type';

@Injectable({
  providedIn: 'root',
})
export class LinkMonobankAccountService {
  private openModalSource = new Subject<void>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal() {
    this.openModalSource.next();
  }
}
