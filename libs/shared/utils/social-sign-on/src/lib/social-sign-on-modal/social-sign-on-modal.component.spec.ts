import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersFacade } from '@ncats-frontend-library/stores/user-store';

import { SocialSignOnModalComponent } from './social-sign-on-modal.component';

describe('SocialSignOnModalComponent', () => {
  let component: SocialSignOnModalComponent;
  let fixture: ComponentFixture<SocialSignOnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialSignOnModalComponent],
      imports: [
        MatDialogModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: UsersFacade, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialSignOnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
