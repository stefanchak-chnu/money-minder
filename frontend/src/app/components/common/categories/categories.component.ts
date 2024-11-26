import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { Category, CategoryType } from '../../../models/category';
import { CategoryService } from '../../../services/api/category-service';
import { sideModalOpenClose } from '../../../animations/side-modal-open-close';
import { bottomModalOpenClose } from '../../../animations/bottom-modal-open-close';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [MatIcon, NgIf, NgForOf],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  animations: [sideModalOpenClose, bottomModalOpenClose],
})
export class CategoriesComponent implements OnInit {
  protected isSubCategoriesOpened: boolean = false;

  protected categories: Category[] = [];
  protected parentCategory: Category | undefined = undefined;

  // @ts-ignore
  @Input() type: CategoryType;
  @Output() selectedCategory = new EventEmitter<Category>();

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories(this.type).subscribe((categories) => {
      this.categories = categories;
    });
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.closeModal();
  }

  closeModal() {
    this.selectedCategory.emit(undefined);
    this.closeSubCategoriesModal();
  }

  closeSubCategoriesModal() {
    this.isSubCategoriesOpened = false;
  }

  selectCategory(category: Category) {
    if (category.subCategories && category.subCategories.length > 0) {
      this.parentCategory = category;
      this.isSubCategoriesOpened = true;
    } else {
      this.selectedCategory.emit(category);
    }
  }

  selectSubCategory(subCategory: Category) {
    this.selectedCategory.emit(subCategory);
  }

  onSwipeRight() {
    this.closeModal();
  }
}
