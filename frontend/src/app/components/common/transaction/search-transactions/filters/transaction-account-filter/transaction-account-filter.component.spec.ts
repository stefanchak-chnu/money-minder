import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAccountFilterComponent } from './transaction-account-filter.component';

describe('TransactionAccountFilterComponent', () => {
  let component: TransactionAccountFilterComponent;
  let fixture: ComponentFixture<TransactionAccountFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionAccountFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionAccountFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
