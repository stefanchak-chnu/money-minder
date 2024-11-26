import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CategoriesSettingsService } from '../../services/communication/categories-settings-service';
import { AccountService } from '../../services/api/account-service';
import { Account } from '../../models/account';
import { NgIf } from '@angular/common';
import { TransactionAccountFilterComponent } from '../common/transaction/search-transactions/filters/transaction-account-filter/transaction-account-filter.component';
import { CategorySettingsComponent } from './category-settings/category-settings.component';
import { RulesSettingsComponent } from './rules-settings/rules-settings.component';
import { RulesSettingsService } from '../../services/communication/rules-settings-service';
import { HeaderComponent } from '../common/header/header.component';
import { NavComponent } from '../common/nav/nav.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewSpacesService } from '../../services/communication/view-spaces-service';
import {ViewBanksService} from "../../services/communication/view-banks-service";
import {BanksComponent} from "./banks/banks.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatIcon,
    NgIf,
    TransactionAccountFilterComponent,
    CategorySettingsComponent,
    RulesSettingsComponent,
    HeaderComponent,
    NavComponent,
    ProfileComponent,
    BanksComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  protected defaultAccount: Account | undefined = undefined;
  protected isAccountFilterOpened: boolean = false;

  constructor(
    private categoriesSettingsService: CategoriesSettingsService,
    private rulesSettingsService: RulesSettingsService,
    private accountService: AccountService,
    private viewSpacesService: ViewSpacesService,
    private viewBanksService: ViewBanksService,
  ) {}

  ngOnInit(): void {
    this.accountService
      .getDefaultAccount()
      .subscribe((account) => (this.defaultAccount = account));
  }

  openCategorySettings() {
    this.categoriesSettingsService.openModal(true);
  }

  openRulesSettings() {
    this.rulesSettingsService.openModal(true);
  }

  selectDefaultAccount() {
    this.isAccountFilterOpened = true;
  }

  closeAccountFilter() {
    this.isAccountFilterOpened = false;
  }

  onAccountSelected(account: Account) {
    this.defaultAccount = account;
    this.accountService.updateDefaultAccount(account).subscribe();
  }

  openSpaces() {
    this.viewSpacesService.openModal();
  }

  openBanks() {
    this.viewBanksService.openModal(false);
  }
}
