import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLoginComponent } from './service-login.component';

describe('ServiceLoginComponent', () => {
  let component: ServiceLoginComponent;
  let fixture: ComponentFixture<ServiceLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
