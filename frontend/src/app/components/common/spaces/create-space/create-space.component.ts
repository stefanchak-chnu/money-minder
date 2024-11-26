import { Component } from '@angular/core';
import { CreateSpaceService } from '../../../../services/communication/create-space-service';
import { CurrencyService } from '../../../../services/api/currency-service';
import { Currency } from '../../../../models/currency';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpaceService } from '../../../../services/api/space-service';
import { Space } from '../../../../models/space';
import { sideModalOpenClose } from '../../../../animations/side-modal-open-close';

@Component({
  selector: 'app-create-space',
  standalone: true,
  imports: [NgIf, MatIcon, NgClass, FormsModule, NgForOf, ReactiveFormsModule],
  templateUrl: './create-space.component.html',
  styleUrl: './create-space.component.scss',
  animations: [sideModalOpenClose],
})
export class CreateSpaceComponent {
  protected isOpened: boolean = false;
  protected spaceToEdit: Space | undefined = undefined;
  protected currencies: Currency[] = [];
  protected spaceName: string | undefined = undefined;
  protected currency: Currency | undefined = undefined;

  constructor(
    private createSpaceService: CreateSpaceService,
    private currencyService: CurrencyService,
    private spaceService: SpaceService,
  ) {
    this.createSpaceService.modalOpened$.subscribe((space) => {
      this.spaceToEdit = space;
      this.spaceName = this.spaceToEdit?.name;
      this.openModal();
      this.getCurrencies();
    });
  }

  private getCurrencies() {
    this.currencyService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
      this.currency = this.currencies[0];
    });
  }

  private openModal() {
    this.isOpened = true;
  }

  closeModal() {
    this.isOpened = false;
  }

  save() {
    if (this.spaceName === undefined || this.spaceName === '') {
      return;
    }

    if (this.spaceToEdit) {
      this.spaceService
        .updateName(this.spaceToEdit.id, this.spaceName)
        .subscribe(() => {
          this.closeModal();
          // @ts-ignore
          this.spaceToEdit.name = this.spaceName;
          localStorage.setItem('space', JSON.stringify(this.spaceToEdit));
          this.spaceService.triggerSpaceUpdated();
        });
    } else {
      let request = {
        name: this.spaceName,
        primaryCurrencyCode: this.currency?.code,
      };

      this.spaceService.createSpace(request).subscribe((space) => {
        this.closeModal();
        this.spaceService.switchSpace(space.id);
      });
    }
  }

  onSwipeRight() {
    this.closeModal();
  }
}
