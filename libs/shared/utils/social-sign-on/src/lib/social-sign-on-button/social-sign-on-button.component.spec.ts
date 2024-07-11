import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  USERS_FEATURE_KEY,
  usersReducer,
} from '@ncats-frontend-library/stores/user-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SocialSignOnButtonComponent } from './social-sign-on-button.component';

describe('SocialSignOnButtonComponent', () => {
  let component: SocialSignOnButtonComponent;
  let fixture: ComponentFixture<SocialSignOnButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        SocialSignOnButtonComponent,
        NoopAnimationsModule,
        MatDialogModule,
        MatMenuModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialSignOnButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
