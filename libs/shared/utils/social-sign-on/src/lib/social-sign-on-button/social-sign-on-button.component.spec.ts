import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersFacade } from '@ncats-frontend-library/stores/user-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SocialSignOnButtonComponent } from './social-sign-on-button.component';

describe('SocialSignOnButtonComponent', () => {
  let component: SocialSignOnButtonComponent;
  let fixture: ComponentFixture<SocialSignOnButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialSignOnButtonComponent],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatMenuModule,
        StoreModule.forRoot(
          {},
          {
            metaReducers: [],
            runtimeChecks: {
              strictActionImmutability: true,
              strictStateImmutability: true,
            },
          }
        ),
        EffectsModule.forRoot([]),
      ],
      providers: [UsersFacade],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialSignOnButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
