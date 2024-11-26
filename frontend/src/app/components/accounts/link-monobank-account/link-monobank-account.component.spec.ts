import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkMonobankAccountComponent } from './link-monobank-account.component';

describe('LinkMonobankAccountComponent', () => {
  let component: LinkMonobankAccountComponent;
  let fixture: ComponentFixture<LinkMonobankAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkMonobankAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkMonobankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
