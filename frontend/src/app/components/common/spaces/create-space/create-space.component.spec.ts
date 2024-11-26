import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpaceComponent } from './create-space.component';

describe('CreateSpaceComponent', () => {
  let component: CreateSpaceComponent;
  let fixture: ComponentFixture<CreateSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSpaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
