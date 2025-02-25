import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import {
  ARTICLE_STORE_FEATURE_KEY,
  articlesReducer,
} from '@ncats-frontend-library/stores/article-store';
import {
  DISEASES_FEATURE_KEY,
  diseasesReducer,
} from '@ncats-frontend-library/stores/disease-store';
import {
  PROJECTS_FEATURE_KEY,
  projectsReducer,
} from '@ncats-frontend-library/stores/grant-store';
import {
  TRIALS_FEATURE_KEY,
  trialsReducer,
} from '@ncats-frontend-library/stores/trial-store';
import {
  USERS_FEATURE_KEY,
  usersReducer,
} from '@ncats-frontend-library/stores/user-store';
import { StoreModule } from '@ngrx/store';

import { RdasDiseasePageComponent } from './rdas-disease-page.component';

describe('RdasDiseasePageComponent', () => {
  let component: RdasDiseasePageComponent;
  let fixture: ComponentFixture<RdasDiseasePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RdasDiseasePageComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, diseasesReducer),
        StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
        StoreModule.forFeature(ARTICLE_STORE_FEATURE_KEY, articlesReducer),
        StoreModule.forFeature(PROJECTS_FEATURE_KEY, projectsReducer),
        StoreModule.forFeature(TRIALS_FEATURE_KEY, trialsReducer),
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} as ActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(RdasDiseasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
