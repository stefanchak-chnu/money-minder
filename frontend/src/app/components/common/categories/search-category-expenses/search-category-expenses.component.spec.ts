import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCategoryExpensesComponent } from './search-category-expenses.component';

describe('SearchCategoryExpensesComponent', () => {
  let component: SearchCategoryExpensesComponent;
  let fixture: ComponentFixture<SearchCategoryExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCategoryExpensesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchCategoryExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
