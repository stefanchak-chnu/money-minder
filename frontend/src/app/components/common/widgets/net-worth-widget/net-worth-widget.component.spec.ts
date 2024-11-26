import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetWorthWidgetComponent } from './net-worth-widget.component';

describe('NetWorthWidgetComponent', () => {
  let component: NetWorthWidgetComponent;
  let fixture: ComponentFixture<NetWorthWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetWorthWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetWorthWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
