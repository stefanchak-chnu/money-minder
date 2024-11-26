import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesSettingsComponent } from './rules-settings.component';

describe('RulesSettingsComponent', () => {
  let component: RulesSettingsComponent;
  let fixture: ComponentFixture<RulesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RulesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
