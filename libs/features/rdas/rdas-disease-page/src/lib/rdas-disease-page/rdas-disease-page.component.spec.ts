import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DISEASES_FEATURE_KEY, DiseasesFacade, reducer } from "@ncats-frontend-library/stores/disease-store";
import { EffectsModule } from "@ngrx/effects";
import { Store, StoreModule } from "@ngrx/store";

import { RdasDiseasePageComponent } from './rdas-disease-page.component';

describe('RdasDiseasePageComponent', () => {
  let component: RdasDiseasePageComponent;
  let fixture: ComponentFixture<RdasDiseasePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdasDiseasePageComponent ],
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(DISEASES_FEATURE_KEY, reducer)
      ],
      providers: [
        DiseasesFacade
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdasDiseasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
