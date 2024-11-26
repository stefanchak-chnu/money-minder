import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AccountType } from '../../models/account-type';

@Injectable({
  providedIn: 'root',
})
export class RulesSettingsService {
  private openModalSource = new Subject<boolean>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(opened: boolean) {
    this.openModalSource.next(opened);
  }
}
