import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DISEASES_FEATURE_KEY,
  diseasesReducer,
} from '@ncats-frontend-library/stores/disease-store';
import {
  USERS_FEATURE_KEY,
  usersReducer,
} from '@ncats-frontend-library/stores/user-store';
import { StoreModule } from '@ngrx/store';
import { SharedUtilsDataNotFoundComponent } from './shared-utils-data-not-found.component';

describe('SharedUtilsDataNotFoundComponent', () => {
  let component: SharedUtilsDataNotFoundComponent;
  let fixture: ComponentFixture<SharedUtilsDataNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedUtilsDataNotFoundComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, diseasesReducer),
        StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedUtilsDataNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
