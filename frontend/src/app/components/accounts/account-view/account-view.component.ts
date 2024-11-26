import { Component, HostListener, OnDestroy } from '@angular/core';
import { ViewAccountService } from '../../../services/communication/view-account-service';
import { Account } from '../../../models/account';
import { MatIcon } from '@angular/material/icon';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SearchTransactionsService } from '../../../services/communication/search-transactions-service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoaderComponent } from '../../common/loader/loader.component';
import { TransactionComponent } from '../../common/transaction/transaction.component';
import { Transaction } from '../../../models/transaction';
import { TransactionService } from '../../../services/api/transaction-service';
import { CreateTransactionButtonComponent } from '../../common/transaction/create-transaction-button/create-transaction-button.component';
import { AccountService } from '../../../services/api/account-service';
import { UpdateAccountService } from '../../../services/communication/update-account-service';
import { UpdateAccountComponent } from '../update-account/update-account.component';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-view',
  standalone: true,
  imports: [
    MatIcon,
    NgIf,
    NgClass,
    InfiniteScrollModule,
    LoaderComponent,
    NgForOf,
    TransactionComponent,
    CreateTransactionButtonComponent,
    UpdateAccountComponent,
  ],
  templateUrl: './account-view.component.html',
  styleUrl: './account-view.component.scss',
  animations: [sideModalOpenClose],
})
export class AccountViewComponent {
  protected isOpen: boolean = false;
  protected account: Account | undefined;

  protected accountTransactions: Transaction[] = [];
  protected currentPage: number = 0;
  protected itemsPerPage: number = 20;
  protected hasMoreTransactions: boolean = true;
  protected searchQuery: string = '';
  protected isLoading: boolean = true;

  protected refreshTransactionsSubscription: Subscription | undefined = undefined;
  protected updatedAccountSubscription: Subscription | undefined = undefined;

  constructor(
    private viewAccountService: ViewAccountService,
    private searchTransactionsService: SearchTransactionsService,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private updateAccountService: UpdateAccountService,
  ) {
    this.viewAccountService.modalOpened$.subscribe((account) => {
      this.account = account;
      this.openModal();
      this.loadTransactions();

      this.refreshTransactionsSubscription =
        this.transactionService.refreshTransactions$.subscribe(() => {
          this.accountTransactions = [];
          this.loadTransactions();
        });
      this.transactionService.refreshAccountBalance$.subscribe(() => {
        this.loadUpdatedAccount();
      });
      this.updatedAccountSubscription =
        this.accountService.updatedAccount$.subscribe(() => {
          this.loadUpdatedAccount();
          this.accountTransactions = [];
          this.loadTransactions();
        });
    });
  }

  private loadTransactions() {
    this.isLoading = true;
    this.transactionService
      .searchTransactions(
        this.currentPage,
        this.itemsPerPage,
        this.searchQuery,
        this.account?.id,
        undefined,
        false,
        undefined,
        undefined,
      )
      .subscribe((pageResponse) => {
        this.accountTransactions = this.accountTransactions.concat(
          pageResponse.content,
        );
        this.hasMoreTransactions = !pageResponse.last;
        this.isLoading = false;
      });
  }

  private loadUpdatedAccount() {
    this.accountService.getAccount(this.account!.id!).subscribe((account) => {
      this.account = account;
    });
  }

  private openModal() {
    this.accountTransactions = [];
    this.isOpen = true;
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.closeModal();
  }

  closeModal() {
    this.isOpen = false;
    this.currentPage = 0;
    this.refreshTransactionsSubscription?.unsubscribe();
    this.updatedAccountSubscription?.unsubscribe();
  }

  openSearch() {
    this.searchTransactionsService.openModal({ account: this.account });
  }

  loadMore() {
    if (this.hasMoreTransactions) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  editModal() {
    this.updateAccountService.openModal(this.account!);
  }
}
