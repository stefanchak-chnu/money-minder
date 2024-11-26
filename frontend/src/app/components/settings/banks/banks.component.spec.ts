import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksComponent } from './banks.component';

describe('BanksComponent', () => {
  let component: BanksComponent;
  let fixture: ComponentFixture<BanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
