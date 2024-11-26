import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DatePipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { AutoResizeDirective } from '../../../../directives/auto-resize.directive';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Transaction, TransactionType } from '../../../../models/transaction';
import { ViewTransactionService } from '../../../../services/communication/view-transaction-service';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { TransactionService } from '../../../../services/api/transaction-service';
import { CategoriesComponent } from '../../categories/categories.component';
import { Category, CategoryType } from '../../../../models/category';
import { TransactionAccountFilterComponent } from '../search-transactions/filters/transaction-account-filter/transaction-account-filter.component';
import { Account } from '../../../../models/account';
import { bottomModalOpenClose } from '../../../../animations/bottom-modal-open-close';

@Component({
  selector: 'app-transaction-view',
  standalone: true,
  imports: [
    NgIf,
    AutoResizeDirective,
    FormsModule,
    MatIcon,
    NgForOf,
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatSuffix,
    CategoriesComponent,
    NgClass,
    TransactionAccountFilterComponent,
  ],
  templateUrl: './transaction-view.component.html',
  styleUrl: './transaction-view.component.scss',
  animations: [bottomModalOpenClose],
})
export class TransactionViewComponent implements OnInit, AfterViewChecked {
  protected isOpened: boolean = false;
  protected editName: boolean = false;
  protected isFromAccountFilterOpened: boolean = false;
  protected isToAccountFilterOpened: boolean = false;
  protected isCategorySelectModalOpened: boolean = false;

  protected transaction!: Transaction;

  protected readonly CategoryType = CategoryType;
  protected readonly TransactionType = TransactionType;

  protected transactionForm: FormGroup;

  // @ts-ignore
  @ViewChild('amountInput') protected amountInput: ElementRef;
  // @ts-ignore
  @ViewChild('nameInput') nameInputRef: ElementRef;

  constructor(
    private viewTransactionService: ViewTransactionService,
    private transactionService: TransactionService,
  ) {
    this.transactionForm = new FormGroup({
      name: new FormControl('', Validators.required),
      amount: new FormControl(Validators.required),
      fromAccount: new FormControl(),
      toAccount: new FormControl(),
      type: new FormControl(Validators.required),
      date: new FormControl(Validators.required),
      notes: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.viewTransactionService.modalOpened$.subscribe((transaction) => {
      this.transaction = transaction;

      this.transactionForm.controls['name'].setValue(transaction.name);
      this.transactionForm.controls['date'].setValue(transaction.date);
      this.transactionForm.controls['fromAccount'].setValue(
        transaction.account,
      );
      this.transactionForm.controls['toAccount'].setValue(
        transaction.toAccount,
      );
      this.transactionForm.controls['type'].setValue(transaction.type);
      this.transactionForm.controls['notes'].setValue(transaction.notes);
      this.transactionForm.controls['amount'].setValue(transaction.amount);

      if (transaction.isBankTransaction) {
        this.transactionForm.controls['amount'].disable();
      } else {
        this.transactionForm.controls['amount'].enable();
      }

      this.showModal();
    });
  }

  ngAfterViewChecked() {
    if (this.editName) {
      this.nameInputRef.nativeElement.focus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.closeModal();
  }

  showModal() {
    this.isOpened = true;
    setTimeout(() => {
      this.formatAmount();
    }, 100);
  }

  closeModal() {
    this.isOpened = false;
    this.editName = false;
    this.transactionForm.reset();
  }

  formatAmount() {
    let value = this.transactionForm.controls['amount'].value;
    if (!value || value === 0) {
      this.transactionForm.setErrors({ invalid: true });
      return;
    }

    value = parseFloat(value).toFixed(2);
    this.transactionForm.controls['amount'].setValue(value, {
      emitEvent: false,
    });

    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    this.amountInput.nativeElement.dispatchEvent(event);
  }

  inputTransactionNameBlur() {
    this.editName = false;
  }

  selectCategory() {
    this.isCategorySelectModalOpened = true;
  }

  onCategorySelected(category: Category) {
    this.isCategorySelectModalOpened = false;
    this.transaction.category = category;
  }

  openFromAccountFilter() {
    if (
      this.transaction.type !== this.transactionForm.controls['type'].value &&
      this.transaction.type === TransactionType.INCOME
    ) {
      this.isFromAccountFilterOpened = true;
    }
  }

  closeFromAccountFilter() {
    this.isFromAccountFilterOpened = false;
  }

  openToAccountFilter() {
    this.isToAccountFilterOpened = true;
  }

  closeToAccountFilter() {
    this.isToAccountFilterOpened = false;
  }

  onFromAccountSelected(account: Account) {
    this.transactionForm.controls['fromAccount'].setValue(account);
  }

  onToAccountSelected(account: Account) {
    this.transactionForm.controls['toAccount'].setValue(account);
  }

  showExpensesView() {
    this.transactionForm.controls['type'].setValue(TransactionType.EXPENSE);
  }

  showTransferView() {
    if (this.transaction.type == TransactionType.INCOME) {
      this.transactionForm.controls['toAccount'].setValue(
        this.transaction.account,
      );
      this.transactionForm.controls['fromAccount'].setValue(undefined);
    }
    this.transactionForm.controls['type'].setValue(TransactionType.TRANSFER);
  }

  save() {
    let fromAccount = this.transactionForm.controls['fromAccount'].value;
    let type = this.transactionForm.controls['type'].value;
    let toAccount = this.transactionForm.controls['toAccount'].value;

    if (
      type === TransactionType.TRANSFER &&
      (fromAccount === undefined || toAccount === undefined)
    ) {
      return;
    } else if (
      type !== TransactionType.TRANSFER &&
      this.transaction.account.id === toAccount?.id
    ) {
      return;
    }

    let categoryId = this.transaction.category?.id;

    if (this.transaction.type != type && type === TransactionType.TRANSFER) {
      categoryId = undefined;
    }

    let updateRequest = {
      name: this.transactionForm.controls['name'].value,
      amount: this.transactionForm.controls['amount'].value,
      fromAccountId: fromAccount?.id,
      toAccountId: toAccount?.id,
      type: type,
      date: new Date(this.transactionForm.controls['date'].value),
      notes: this.transactionForm.controls['notes'].value,
      categoryId: categoryId,
    };
    this.transactionService
      .update(this.transaction.id, updateRequest)
      .subscribe((updatedTransaction: Transaction) => {
        this.transaction.type = updatedTransaction.type;
        this.transaction.category = updatedTransaction.category;
        this.transaction.name = updatedTransaction.name;
        this.transaction.notes = updatedTransaction.notes;
        this.transaction.date = updatedTransaction.date;
        this.transaction.amount = updatedTransaction.amount;
        this.transaction.fromAccount = updatedTransaction.fromAccount;
        this.transaction.toAccount = updatedTransaction.toAccount;
        this.closeModal();
      });
  }

  delete() {
    this.transactionService.delete(this.transaction).subscribe((data) => {
      this.closeModal();
    });
  }

  onSwipeRight() {
    this.closeModal();
  }
}
