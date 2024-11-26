import {Component} from '@angular/core';
import {NavComponent} from '../common/nav/nav.component';
import {MatIcon} from '@angular/material/icon';
import {TypeGroupedAccounts} from '../../models/typeGroupedAccounts';
import {NgForOf} from '@angular/common';
import {AccountService} from '../../services/api/account-service';
import {ViewAccountService} from "../../services/communication/view-account-service";
import {Account} from "../../models/account";
import {NetWorthWidgetComponent} from "../common/widgets/net-worth-widget/net-worth-widget.component";
import {HeaderComponent} from "../common/header/header.component";
import {AccountViewComponent} from "./account-view/account-view.component";
import {CreateAccountComponent} from "./create-account/create-account.component";
import {SelectAccountTypeComponent} from "./select-account-type/select-account-type.component";
import {CategoryExpensesComponent} from "../common/categories/category-expenses/category-expenses.component";
import {CreateTransactionComponent} from "../common/transaction/create-transaction/create-transaction.component";
import {SearchTransactionsComponent} from "../common/transaction/search-transactions/search-transactions.component";
import {TransactionViewComponent} from "../common/transaction/transaction-view/transaction-view.component";
import {CategoriesComponent} from "../common/categories/categories.component";

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    NavComponent,
    MatIcon,
    NgForOf,
    NetWorthWidgetComponent,
    HeaderComponent,
    AccountViewComponent,
    CreateAccountComponent,
    SelectAccountTypeComponent,
    CategoryExpensesComponent,
    CreateTransactionComponent,
    SearchTransactionsComponent,
    TransactionViewComponent,
    CategoriesComponent,
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
})
export class AccountsComponent {
  protected types: TypeGroupedAccounts[] = [];

  constructor(
    private accountService: AccountService,
    private viewAccountService: ViewAccountService,
  ) {
    this.loadAccounts();
    this.accountService.newAccount$.subscribe(() => {
      this.loadAccounts();
    });
    this.accountService.updatedAccount$.subscribe(() => {
      this.loadAccounts();
    })

    history.pushState(null, '');
  }

  private loadAccounts() {
    this.accountService
      .getTypeGroupedAccounts()
      .subscribe((types) => (this.types = types));
  }

  openAccountView(account: Account) {
    this.viewAccountService.openModal(account);
  }
}
