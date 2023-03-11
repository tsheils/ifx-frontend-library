import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSignOnModalComponent } from './email-sign-on-modal.component';

describe('EmailSignOnModalComponent', () => {
  let component: EmailSignOnModalComponent;
  let fixture: ComponentFixture<EmailSignOnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailSignOnModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailSignOnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
