import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CreateTransactionService } from '../../../../services/communication/create-transaction-service';
import { Account } from '../../../../models/account';

@Component({
  selector: 'app-create-transaction-button',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './create-transaction-button.component.html',
  styleUrl: './create-transaction-button.component.scss',
})
export class CreateTransactionButtonComponent {
  @Input() preSelectedAccount: Account | undefined = undefined;

  constructor(private createTransactionService: CreateTransactionService) {}

  openCreateTransactionModal() {
    this.createTransactionService.openModal(this.preSelectedAccount);
  }
}
