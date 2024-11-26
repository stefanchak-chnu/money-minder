import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopExpensesWidgetComponent } from './top-expenses-widget.component';

describe('TopExpensesWidgetComponent', () => {
  let component: TopExpensesWidgetComponent;
  let fixture: ComponentFixture<TopExpensesWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopExpensesWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopExpensesWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
