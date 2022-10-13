import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from "@angular/material/dialog";

import { SocialSignOnButtonComponent } from './social-sign-on-button.component';

describe('SocialSignOnButtonComponent', () => {
  let component: SocialSignOnButtonComponent;
  let fixture: ComponentFixture<SocialSignOnButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialSignOnButtonComponent ],
      imports:[MatDialogModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialSignOnButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
