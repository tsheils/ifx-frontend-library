import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Disease } from '@ncats-frontend-library/models/rdas';
import {
  DISEASES_FEATURE_KEY,
  diseasesReducer,
} from '@ncats-frontend-library/stores/disease-store';
import {
  USERS_FEATURE_KEY,
  usersReducer,
} from '@ncats-frontend-library/stores/user-store';
import { StoreModule } from '@ngrx/store';

import { DiseaseListCardComponent } from './disease-list-card.component';

describe('DiseaseListCardComponent', () => {
  let component: DiseaseListCardComponent;
  let fixture: ComponentFixture<DiseaseListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MatCardModule,
        DiseaseListCardComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, diseasesReducer),
        StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseListCardComponent);
    component = fixture.componentInstance;
    component.disease = new Disease({ name: 'tim', gardId: 'GARD:1234' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
