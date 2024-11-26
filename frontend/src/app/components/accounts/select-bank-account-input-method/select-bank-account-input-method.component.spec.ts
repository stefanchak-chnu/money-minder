import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBankAccountInputMethodComponent } from './select-bank-account-input-method.component';

describe('SelectBankAccountInputMethodComponent', () => {
  let component: SelectBankAccountInputMethodComponent;
  let fixture: ComponentFixture<SelectBankAccountInputMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectBankAccountInputMethodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectBankAccountInputMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
