import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgForOf } from '@angular/common';
import { CategoryService } from '../../../../services/api/category-service';
import { Category, CategoryType } from '../../../../models/category';
import { sideModalOpenClose } from '../../../../animations/side-modal-open-close';

@Component({
  selector: 'app-categories-filter',
  standalone: true,
  imports: [MatIcon, NgForOf],
  templateUrl: './categories-filter.component.html',
  styleUrl: './categories-filter.component.scss',
  animations: [sideModalOpenClose],
})
export class CategoriesFilterComponent {
  @Input()
  categoryType: CategoryType = CategoryType.EXPENSE;

  @Input()
  unselectedCategories: string[] = [];

  @Output()
  categoriesUnselected: any = new EventEmitter<string[]>();

  protected categories: Category[] = [];

  constructor(private categoriesService: CategoryService) {
    this.categoriesService
      .getCategories(this.categoryType)
      .subscribe((categories) => (this.categories = categories));
  }

  closeModal() {
    this.categoriesUnselected.emit(this.unselectedCategories);
  }

  apply() {
    this.categoriesUnselected.emit(this.unselectedCategories);
  }

  reset() {
    this.unselectedCategories = [];
  }

  uncheckCategory(category: Category) {
    this.unselectedCategories.push(category.id!);
  }

  onSwipeRight() {
    this.closeModal();
  }
}
