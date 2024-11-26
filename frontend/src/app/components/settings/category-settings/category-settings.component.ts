import { Component, HostListener, OnInit } from '@angular/core';
import { CategoriesSettingsService } from '../../../services/communication/categories-settings-service';
import { NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { CategoryService } from '../../../services/api/category-service';
import { Category, CategoryType } from '../../../models/category';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { LoaderComponent } from '../../common/loader/loader.component';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';

@Component({
  selector: 'app-category-settings',
  standalone: true,
  imports: [NgIf, MatIcon, NgForOf, MatTabGroup, MatTab, LoaderComponent],
  templateUrl: './category-settings.component.html',
  styleUrl: './category-settings.component.scss',
  animations: [sideModalOpenClose],
})
export class CategorySettingsComponent implements OnInit {
  protected isOpened: boolean = false;

  protected expenseCategories: Category[] = [];
  protected incomeCategories: Category[] = [];

  protected isExpenseTabActive: boolean = true;
  protected isIncomeTabActive: boolean = false;

  constructor(
    private categoriesSettingsService: CategoriesSettingsService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.categoriesSettingsService.modalOpened$.subscribe(() => {
      this.showModal();
      this.loadCategories();
    });
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.expenseCategories = categories.filter(
        (category) => category.type === CategoryType.EXPENSE,
      );
      this.incomeCategories = categories.filter(
        (category) => category.type === CategoryType.INCOME,
      );
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

  addCategory() {}

  viewCategory(category: Category) {}

  viewSubCategory(subCategory: Category) {}

  selectExpenseTab() {
    this.isExpenseTabActive = true;
    this.isIncomeTabActive = false;
  }

  selectIncomeTab() {
    this.isIncomeTabActive = true;
    this.isExpenseTabActive = false;
  }

  onSwipeRight() {
    this.closeModal();
  }
}
