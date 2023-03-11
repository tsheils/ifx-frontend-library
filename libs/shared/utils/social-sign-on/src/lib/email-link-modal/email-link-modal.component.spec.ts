import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLinkModalComponent } from './email-link-modal.component';

describe('EmailLinkModalComponent', () => {
  let component: EmailLinkModalComponent;
  let fixture: ComponentFixture<EmailLinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailLinkModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
