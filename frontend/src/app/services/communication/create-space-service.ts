import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Space} from "../../models/space";

@Injectable({
  providedIn: 'root',
})
export class CreateSpaceService {
  private openModalSource = new Subject<Space | undefined>();

  modalOpened$ = this.openModalSource.asObservable();

  openModal(space?: Space) {
    this.openModalSource.next(space);
  }
}
