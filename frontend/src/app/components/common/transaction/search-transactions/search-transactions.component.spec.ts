import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTransactionsComponent } from './search-transactions.component';

describe('SearchTransactionsComponent', () => {
  let component: SearchTransactionsComponent;
  let fixture: ComponentFixture<SearchTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
