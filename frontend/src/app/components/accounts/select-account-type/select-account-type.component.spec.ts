import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAccountTypeComponent } from './select-account-type.component';

describe('SelectAccountTypeComponent', () => {
  let component: SelectAccountTypeComponent;
  let fixture: ComponentFixture<SelectAccountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectAccountTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
