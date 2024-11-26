import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { TransactionType } from '../../../../models/transaction';
import { AutoResizeDirective } from '../../../../directives/auto-resize.directive';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CreateTransactionService } from '../../../../services/communication/create-transaction-service';
import { AccountService } from '../../../../services/api/account-service';
import { Category, CategoryType } from '../../../../models/category';
import { TransactionAccountFilterComponent } from '../search-transactions/filters/transaction-account-filter/transaction-account-filter.component';
import { Account } from '../../../../models/account';
import { TransactionService } from '../../../../services/api/transaction-service';
import { CategoriesComponent } from '../../categories/categories.component';
import { sideModalOpenClose } from '../../../../animations/side-modal-open-close';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [
    NgIf,
    AutoResizeDirective,
    DatePipe,
    DecimalPipe,
    FormsModule,
    MatIcon,
    ReactiveFormsModule,
    NgClass,
    TransactionAccountFilterComponent,
    CategoriesComponent,
  ],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.scss',
  animations: [sideModalOpenClose],
})
export class CreateTransactionComponent {
  protected isOpened: boolean = false;

  isExpenseTabActive: boolean = true;
  isIncomeTabActive: boolean = false;
  isTransferTabActive: boolean = false;

  isAccountFilterOpened: boolean = false;
  isToAccountFilterOpened: boolean = false;
  isCategorySelectModalOpened: boolean = false;

  // @ts-ignore
  @ViewChild('amountInput') protected amountInput: ElementRef;

  protected category: Category | undefined = undefined;
  protected transactionType: TransactionType = TransactionType.EXPENSE;

  protected transactionForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    amount: new FormControl('0.00', Validators.min(0.01)),
    account: new FormControl(Validators.required),
    toAccount: new FormControl(),
    date: new FormControl(new Date(), Validators.required),
    notes: new FormControl(''),
  });

  constructor(
    private createTransactionService: CreateTransactionService,
    private accountService: AccountService,
    private transactionService: TransactionService,
  ) {
    this.createTransactionService.modalOpened$.subscribe(
      (preselectedAccount) => {
        if (preselectedAccount === undefined) {
          this.accountService.getDefaultAccount().subscribe((account) => {
            this.transactionForm.controls['account'].setValue(account);
          });
        } else {
          this.transactionForm.controls['account'].setValue(preselectedAccount);
        }

        this.openModal();
      },
    );
  }

  private openModal() {
    this.isOpened = true;
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.closeModal();
  }

  closeModal() {
    this.isOpened = false;
    this.transactionForm.controls['name'].setValue('');
    this.transactionForm.controls['amount'].setValue('0.00');
    this.transactionForm.controls['date'].setValue(new Date());
    this.transactionForm.controls['notes'].setValue('');
  }

  selectCategory() {
    this.isCategorySelectModalOpened = true;
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

  selectExpenseTab() {
    this.category = undefined;
    this.transactionForm.controls['toAccount'].setValue(undefined);

    this.isExpenseTabActive = true;
    this.isIncomeTabActive = false;

    this.isTransferTabActive = false;

    this.transactionType = TransactionType.EXPENSE;
  }

  selectIncomeTab() {
    this.category = undefined;
    this.transactionForm.controls['toAccount'].setValue(undefined);

    this.isIncomeTabActive = true;
    this.isExpenseTabActive = false;
    this.isTransferTabActive = false;

    this.transactionType = TransactionType.INCOME;
  }

  selectTransferTab() {
    this.category = undefined;
    this.transactionForm.controls['toAccount'].setValue(
      this.transactionForm.controls['account'].value,
    );

    this.isTransferTabActive = true;
    this.isIncomeTabActive = false;

    this.isExpenseTabActive = false;

    this.transactionType = TransactionType.TRANSFER;
  }

  openAccountFilter() {
    this.isAccountFilterOpened = true;
  }

  closeAccountFilter() {
    this.isAccountFilterOpened = false;
  }

  onAccountSelected(account: Account) {
    this.transactionForm.controls['account'].setValue(account);
  }

  openToAccountFilter() {
    this.isToAccountFilterOpened = true;
  }

  closeToAccountFilter() {
    this.isToAccountFilterOpened = false;
  }

  onToAccountSelected(account: Account) {
    this.transactionForm.controls['toAccount'].setValue(account);
  }

  save() {
    if (!this.transactionForm.valid) {
      return;
    }

    let toAccountId = this.transactionForm.controls['toAccount']?.value?.id;
    let accountId = this.transactionForm.controls['account'].value.id;
    if (this.isTransferTabActive) {
      if (
        toAccountId === null ||
        toAccountId === undefined ||
        accountId === toAccountId
      ) {
        return;
      }
    }

    let createRequest = {
      accountId: accountId,
      fromAccountId: this.isTransferTabActive ? accountId : null,
      toAccountId: this.isTransferTabActive ? toAccountId : null,
      currency:
        this.transactionForm.controls['account'].value.currency.shortName,
      date: new Date(this.transactionForm.controls['date'].value),
      amount: this.transactionForm.controls['amount'].value,
      notes: this.transactionForm.controls['notes'].value,
      name: this.transactionForm.controls['name'].value,
      categoryId: this.category?.id,
      type: this.transactionType,
    };
    this.transactionService.create(createRequest).subscribe((transaction) => {
      this.closeModal();
    });
  }

  onCategorySelected(category: Category) {
    this.category = category;
    this.isCategorySelectModalOpened = false;
  }

  protected readonly CategoryType = CategoryType;
  protected readonly TransactionType = TransactionType;

  onSwipeRight() {
    this.closeModal();
  }
}
