import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDateFilterComponent } from './transaction-date-filter.component';

describe('TransactionDateFilterComponent', () => {
  let component: TransactionDateFilterComponent;
  let fixture: ComponentFixture<TransactionDateFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDateFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionDateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
