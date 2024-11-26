import {Component, HostListener, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../common/nav/nav.component';
import { HeaderComponent } from '../common/header/header.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectAccountTypeComponent } from '../accounts/select-account-type/select-account-type.component';
import { CreateAccountComponent } from '../accounts/create-account/create-account.component';
import { TransactionViewComponent } from '../common/transaction/transaction-view/transaction-view.component';
import { CategorySettingsComponent } from '../settings/category-settings/category-settings.component';
import { SearchTransactionsComponent } from '../common/transaction/search-transactions/search-transactions.component';
import { AccountViewComponent } from '../accounts/account-view/account-view.component';
import { CategoriesComponent } from '../common/categories/categories.component';
import { CreateTransactionComponent } from '../common/transaction/create-transaction/create-transaction.component';
import { CategoryExpensesComponent } from '../common/categories/category-expenses/category-expenses.component';
import { AuthComponent } from '../../auth/auth.component';
import { SpacesComponent } from '../common/spaces/spaces.component';
import { AuthService } from '../../auth/auth.service';
import { NgIf } from '@angular/common';
import { BanksComponent } from '../settings/banks/banks.component';
import { LinkMonobankAccountComponent } from '../accounts/link-monobank-account/link-monobank-account.component';
import { SearchCategoryExpensesComponent } from '../common/categories/search-category-expenses/search-category-expenses.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    HeaderComponent,
    SelectAccountTypeComponent,
    CreateAccountComponent,
    TransactionViewComponent,
    CategorySettingsComponent,
    SearchTransactionsComponent,
    AccountViewComponent,
    CategoriesComponent,
    CreateTransactionComponent,
    CategoryExpensesComponent,
    AuthComponent,
    SpacesComponent,
    NgIf,
    BanksComponent,
    LinkMonobankAccountComponent,
    SearchCategoryExpensesComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'money-minder';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    protected authService: AuthService,
  ) {
    this.initSvgIcons();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Prevent navigation
    history.pushState(null, '', window.location.href);
  }

  ngOnInit() {
    // Push initial state to prevent back navigation
    history.pushState(null, '', window.location.href);
  }

  private initSvgIcons() {
    this.matIconRegistry.addSvgIcon(
      'dashboard',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/chart-square-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'wallet',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/wallet-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'settings',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/settings-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'reload',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/restart-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'edit',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/pen-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'bottle',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/bottle-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'spaces',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/layers-minimalistic-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'add',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/add-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'add-circle',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/add-circle-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'dots',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/menu-dots-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'box',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/box-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'card',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/card-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'money-bag',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/money-bag-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'align',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/align-vertical-center-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'close',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/close-circle-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'calendar-search',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/calendar-search-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'wallet-2',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/wallet-2-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'delete',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/trash-bin-trash-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'arrow-left',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/arrow-left-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'arrow-right',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/arrow-right-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'transfer',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/transfer-horizontal-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'textarea',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/sort-by-alphabet-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'alt-arrow-right',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/alt-arrow-right-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'clipboard-check',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/clipboard-check-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'search',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/magnifer-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'question',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/question-square-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'home',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/home-1-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'home-2',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/home-2-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'bills',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/bill-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'phone',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/phone-rounded-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'gym',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/dumbbell-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'hamburger-menu',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/hamburger-menu-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'percent',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/percent-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'heart',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/heart-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'cart',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/cart-large-2-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'cutlery',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/cutlery-eating-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'mouse',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/mouse-minimalistic-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'delivery',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/delivery-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'gift',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/gift-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'chair',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/chair-2-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'heart-pulse',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/heart-pulse-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'bus',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/bus-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'flame',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/flame-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'bolt',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/bolt-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'clock',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/clock-circle-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'heart',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/heart-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'laptop',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/laptop-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'sim-card',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/sim-card-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'global',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/global-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'gamepad',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/gamepad-minimalistic-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'graph-down',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/graph-down-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'graph-up',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/graph-up-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'safe',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/safe-square-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'user',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/user-rounded-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'bank',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/bank-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'shield-key',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/shield-keyhole-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'document-add',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/document-add-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'login-2',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/login-2-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'confirm',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/unread-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'reorder',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/reorder-1-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'sort',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/sort-svgrepo-com.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      'alt-arrow-down',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/icons/svg/alt-arrow-down-svgrepo-com.svg',
      ),
    );
  }
}
