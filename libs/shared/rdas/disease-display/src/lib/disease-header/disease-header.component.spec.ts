import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { DISEASES_FEATURE_KEY, diseasesReducer } from "@ncats-frontend-library/stores/disease-store";
import { USERS_FEATURE_KEY, usersReducer } from "@ncats-frontend-library/stores/user-store";
import { StoreModule } from "@ngrx/store";
import { DISEASELISTMOCK } from "../../test-setup";
import { DiseaseHeaderComponent } from './disease-header.component';

describe('DiseaseHeaderComponent', () => {
  let component: DiseaseHeaderComponent;
  let fixture: ComponentFixture<DiseaseHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        DiseaseHeaderComponent,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, diseasesReducer),
        StoreModule.forFeature(USERS_FEATURE_KEY, usersReducer)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseHeaderComponent);
    component = fixture.componentInstance;
    const disease = signal(DISEASELISTMOCK.diseases[0]);

      fixture.componentInstance.disease =
        disease as unknown as typeof fixture.componentInstance.disease;
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
