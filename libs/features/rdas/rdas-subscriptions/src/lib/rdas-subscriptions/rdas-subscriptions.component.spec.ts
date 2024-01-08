import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedRdasDiseaseDisplayModule } from '@ncats-frontend-library/shared/rdas/disease-display';
import {
  reducer,
  USERS_FEATURE_KEY,
  UsersFacade,
} from '@ncats-frontend-library/stores/user-store';
import { StoreModule } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

import { RdasSubscriptionsComponent } from './rdas-subscriptions.component';

describe('RdasSubscriptionsComponent', () => {
  let component: RdasSubscriptionsComponent;
  let fixture: ComponentFixture<RdasSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RdasSubscriptionsComponent],
      imports: [
        BrowserAnimationsModule,
        SharedRdasDiseaseDisplayModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(USERS_FEATURE_KEY, reducer),
      ],
      providers: [Apollo, UsersFacade],
    }).compileComponents();

    fixture = TestBed.createComponent(RdasSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
