import { Component, HostListener } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { CreateRuleService } from '../../../../services/communication/create-rule-service';
import { RuleService } from '../../../../services/api/rule-service';
import { ConditionTypeEnum } from '../../../../models/rule';
import { Category, CategoryType } from '../../../../models/category';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategorySettingsComponent } from '../../category-settings/category-settings.component';
import { CategoriesComponent } from '../../../common/categories/categories.component';
import { ActionType } from '../../../../models/action-type';
import { TransactionDateFilterComponent } from '../../../common/transaction/search-transactions/filters/transaction-date-filter/transaction-date-filter.component';
import { TransactionAccountFilterComponent } from '../../../common/transaction/search-transactions/filters/transaction-account-filter/transaction-account-filter.component';
import { Account } from '../../../../models/account';
import { sideModalOpenClose } from '../../../../animations/side-modal-open-close';

@Component({
  selector: 'app-create-rule',
  standalone: true,
  imports: [
    NgIf,
    MatIcon,
    NgClass,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    CategorySettingsComponent,
    CategoriesComponent,
    TransactionDateFilterComponent,
    TransactionAccountFilterComponent,
  ],
  templateUrl: './create-rule.component.html',
  styleUrl: './create-rule.component.scss',
  animations: [sideModalOpenClose],
})
export class CreateRuleComponent {
  protected isOpened: boolean = false;

  protected readonly ConditionTypeEnum = ConditionTypeEnum;
  protected readonly ActionType = ActionType;
  protected readonly CategoryType = CategoryType;
  protected actionType: ActionType = ActionType.ASSIGN_CATEGORY;

  protected isCategorySelectModalOpened: boolean = false;
  protected isToAccountFilterOpened: boolean = false;
  protected isFromAccountFilterOpened: boolean = false;

  protected conditionType: ConditionTypeEnum = ConditionTypeEnum.TEXT_CONTAINS;
  protected conditionText: string = '';
  protected assignCategory: Category | undefined = undefined;
  protected markAsTransferToAccount: Account | undefined = undefined;
  protected markAsTransferFromAccount: Account | undefined = undefined;
  protected applyToExistingTransactions: boolean = false;

  constructor(
    private createRuleService: CreateRuleService,
    private ruleService: RuleService,
  ) {
    this.createRuleService.modalOpened$.subscribe(() => {
      this.openModal();
    });
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
    this.conditionText = '';
    this.assignCategory = undefined;
    this.markAsTransferToAccount = undefined;
    this.markAsTransferFromAccount = undefined;
  }

  selectCategory() {
    this.isCategorySelectModalOpened = true;
  }

  selectAccountTo() {
    this.isToAccountFilterOpened = true;
  }

  selectAccountFrom() {
    this.isFromAccountFilterOpened = true;
  }

  selectConditionType(type: ConditionTypeEnum) {
    this.conditionType = type;
  }

  onCategorySelected(category: Category) {
    this.isCategorySelectModalOpened = false;
    this.assignCategory = category;
  }

  onToAccountSelected(toAccount: Account) {
    this.isToAccountFilterOpened = false;
    this.markAsTransferToAccount = toAccount;
  }

  onFromAccountSelected(fromAccount: Account) {
    this.isFromAccountFilterOpened = false;
    this.markAsTransferFromAccount = fromAccount;
  }

  closeToAccountFilter() {
    this.isToAccountFilterOpened = false;
  }

  closeFromAccountFilter() {
    this.isFromAccountFilterOpened = false;
  }

  createRule() {
    if (
      this.conditionText == '' ||
      (this.actionType === ActionType.ASSIGN_CATEGORY &&
        this.assignCategory == undefined) ||
      (this.actionType === ActionType.MARK_AS_TRANSFER_TO &&
        this.markAsTransferToAccount == undefined) ||
      (this.actionType === ActionType.MARK_AS_TRANSFER_FROM &&
        this.markAsTransferFromAccount == undefined)
    ) {
      return;
    }
    let request = {
      assignCategoryId:
        this.actionType === ActionType.ASSIGN_CATEGORY
          ? this.assignCategory?.id
          : undefined,
      markAsTransferToAccountId:
        this.actionType === ActionType.MARK_AS_TRANSFER_TO
          ? this.markAsTransferToAccount?.id
          : undefined,
      markAsTransferFromAccountId:
        this.actionType === ActionType.MARK_AS_TRANSFER_FROM
          ? this.markAsTransferFromAccount?.id
          : undefined,
      conditionText: this.conditionText,
      conditionType: this.conditionType,
    };

    this.ruleService
      .createRule(request, this.applyToExistingTransactions)
      .subscribe(() => {
        this.closeModal();
      });
  }

  onSwipeRight() {
    this.closeModal();
  }
}
