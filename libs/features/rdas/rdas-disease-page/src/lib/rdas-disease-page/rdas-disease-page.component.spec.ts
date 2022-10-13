import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
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
        StoreModule.forRoot(
          {},
          {
            metaReducers: [],
            runtimeChecks: {
              strictActionImmutability: true,
              strictStateImmutability: true,
            },
          }
        ),
        EffectsModule.forRoot([])
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
