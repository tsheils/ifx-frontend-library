import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { DISEASES_FEATURE_KEY, diseasesReducer } from 'disease-store';
import { USERS_FEATURE_KEY, usersReducer } from 'user-store';
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
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, diseasesReducer),
        StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer),
      ],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
