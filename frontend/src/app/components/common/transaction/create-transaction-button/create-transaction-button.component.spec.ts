import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransactionButtonComponent } from './create-transaction-button.component';

describe('CreateTransactionButtonComponent', () => {
  let component: CreateTransactionButtonComponent;
  let fixture: ComponentFixture<CreateTransactionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTransactionButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTransactionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
