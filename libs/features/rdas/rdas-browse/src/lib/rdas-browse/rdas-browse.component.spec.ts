import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DISEASES_FEATURE_KEY, diseasesReducer } from "@ncats-frontend-library/stores/disease-store";
import { FILTERS_FEATURE_KEY, filtersReducer } from "@ncats-frontend-library/stores/filter-store";
import { USERS_FEATURE_KEY, usersReducer } from "@ncats-frontend-library/stores/user-store";
import { StoreModule } from '@ngrx/store';

import { RdasBrowseComponent } from './rdas-browse.component';

describe('RdasBrowseComponent', () => {
  let component: RdasBrowseComponent;
  let fixture: ComponentFixture<RdasBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        RdasBrowseComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, diseasesReducer),
        StoreModule.forFeature(FILTERS_FEATURE_KEY, filtersReducer),
        StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer)
      ],
      providers: [

      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RdasBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
