import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  USERS_FEATURE_KEY, usersReducer
} from "@ncats-frontend-library/stores/user-store";
import { StoreModule } from '@ngrx/store';

import { RdasSubscriptionsComponent } from './rdas-subscriptions.component';

describe('RdasSubscriptionsComponent', () => {
  let component: RdasSubscriptionsComponent;
  let fixture: ComponentFixture<RdasSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RdasSubscriptionsComponent],
      imports: [
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RdasSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
