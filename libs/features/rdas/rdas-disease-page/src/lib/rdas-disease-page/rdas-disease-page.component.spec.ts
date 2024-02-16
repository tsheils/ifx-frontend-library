import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DiseaseEffects, diseasesReducer
} from "@ncats-frontend-library/stores/disease-store";
import { provideEffects } from "@ngrx/effects";
import { provideStore, StoreModule } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";

import { RdasDiseasePageComponent } from './rdas-disease-page.component';

describe('RdasDiseasePageComponent', () => {
  let component: RdasDiseasePageComponent;
  let fixture: ComponentFixture<RdasDiseasePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RdasDiseasePageComponent,
        StoreModule
      ],
      providers: [
        provideStore({
          diseases: diseasesReducer
        }),
        provideEffects([DiseaseEffects]),
        provideStoreDevtools({ maxAge: 25, logOnly: false }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RdasDiseasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
