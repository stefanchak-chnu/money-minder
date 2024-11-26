import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNewBankComponent } from './select-new-bank.component';

describe('SelectNewBankComponent', () => {
  let component: SelectNewBankComponent;
  let fixture: ComponentFixture<SelectNewBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectNewBankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectNewBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
