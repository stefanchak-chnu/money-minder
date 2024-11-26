import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectAccountTypeServiceService {
  private openModalSource = new Subject<boolean>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(opened: boolean) {
    this.openModalSource.next(opened);
  }
}
