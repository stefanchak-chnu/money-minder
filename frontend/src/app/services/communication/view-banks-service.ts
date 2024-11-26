import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountType } from '../../models/account-type';

@Injectable({
  providedIn: 'root',
})
export class ViewBanksService {
  private openModalSource = new Subject<boolean>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(shouldLinkAccount: boolean) {
    this.openModalSource.next(shouldLinkAccount);
  }
}
