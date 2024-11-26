import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectNewBankService {
  private openModalSource = new Subject<boolean>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal() {
    this.openModalSource.next(true);
  }

  closeModal() {
    this.openModalSource.next(false);
  }
}
