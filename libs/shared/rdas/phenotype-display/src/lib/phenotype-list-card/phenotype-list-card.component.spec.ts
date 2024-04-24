import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DISEASES_FEATURE_KEY, diseasesReducer } from "@ncats-frontend-library/stores/disease-store";
import { StoreModule } from "@ngrx/store";
import { PhenotypeListCardComponent } from './phenotype-list-card.component';

describe('PhenotypeListCardComponent', () => {
  let component: PhenotypeListCardComponent;
  let fixture: ComponentFixture<PhenotypeListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PhenotypeListCardComponent,
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, diseasesReducer)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhenotypeListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
