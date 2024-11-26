import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectMonobankComponent } from './connect-monobank.component';

describe('ConnectMonobankComponent', () => {
  let component: ConnectMonobankComponent;
  let fixture: ComponentFixture<ConnectMonobankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectMonobankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectMonobankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
