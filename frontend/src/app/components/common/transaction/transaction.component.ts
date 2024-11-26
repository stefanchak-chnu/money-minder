import { Component, Input } from '@angular/core';
import {Transaction, TransactionType} from '../../../models/transaction';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { ViewTransactionService } from '../../../services/communication/view-transaction-service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [MatIcon, DecimalPipe, DatePipe, NgIf, NgClass],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent {
  @Input() transaction!: Transaction;
  @Input() isLast: boolean = false;

  constructor(private viewTransactionService: ViewTransactionService) {}

  openTransactionView(transaction: Transaction) {
    this.viewTransactionService.openModal(transaction);
  }

  protected readonly TransactionType = TransactionType;
}
