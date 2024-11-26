import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonobankAccountCardComponent } from './monobank-account-card.component';

describe('MonobankAccountCardComponent', () => {
  let component: MonobankAccountCardComponent;
  let fixture: ComponentFixture<MonobankAccountCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonobankAccountCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonobankAccountCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
