import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AutoResizeDirective } from '../../../directives/auto-resize.directive';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Currency } from '../../../models/currency';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../../../services/api/account-service';
import { CurrencyService } from '../../../services/api/currency-service';
import { UpdateAccountService } from '../../../services/communication/update-account-service';
import { Account } from '../../../models/account';
import { bottomModalOpenClose } from '../../../animations/bottom-modal-open-close';

@Component({
  selector: 'app-update-account',
  standalone: true,
  imports: [
    AutoResizeDirective,
    MatIcon,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass,
  ],
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.scss',
  animations: [bottomModalOpenClose],
})
export class UpdateAccountComponent implements OnInit {
  protected isOpened: boolean = false;

  protected account: Account | undefined = undefined;
  protected currencies: Currency[] = [];
  protected accountForm: FormGroup;

  // @ts-ignore
  @ViewChild('balanceInput') protected balanceInput: ElementRef;

  constructor(
    private updateAccountService: UpdateAccountService,
    private accountService: AccountService,
    private currencyService: CurrencyService,
  ) {
    this.accountForm = new FormGroup({
      title: new FormControl('', Validators.required),
      currency: new FormControl(this.currencies[0], Validators.required),
      balance: new FormControl('0.00', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.updateAccountService.modalOpened$.subscribe((account) => {
      this.loadCurrencies();

      this.account = account;

      this.accountForm.controls['title'].setValue(account.name);
      this.accountForm.controls['currency'].setValue(account.currency);

      if (account.balance !== 0) {
        this.accountForm.controls['balance'].setValue(account.balance);
        setTimeout(() => {
          this.formatBalance();
        }, 100);
      } else {
        this.accountForm.controls['balance'].setValue('0.00');
      }

      if (account.isBankAccount) {
        this.accountForm.controls['currency'].disable();
        this.accountForm.controls['balance'].disable();
      }

      this.showModal();
    });
  }

  private loadCurrencies() {
    this.currencyService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
    });
  }

  private showModal() {
    this.isOpened = true;
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.closeModal();
  }

  closeModal() {
    this.isOpened = false;
  }

  formatBalance(): void {
    let balanceValue = this.accountForm.controls['balance'].value;
    if (!balanceValue) {
      return;
    }
    balanceValue = parseFloat(balanceValue).toFixed(2);
    this.accountForm.controls['balance'].setValue(balanceValue, {
      emitEvent: false,
    });

    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    this.balanceInput.nativeElement.dispatchEvent(event);
  }

  createAccount() {
    if (!this.accountForm.valid) {
      return;
    }

    this.accountService
      .updateAccount(this.account?.id!, {
        name: this.accountForm.controls['title'].value,
        currencyCode: this.accountForm.controls['currency'].value.code,
        balance: parseFloat(
          parseFloat(this.accountForm.controls['balance'].value).toFixed(2),
        ),
      })
      .subscribe((account) => {
        this.account = account;
        this.closeModal();
      });
  }
}
