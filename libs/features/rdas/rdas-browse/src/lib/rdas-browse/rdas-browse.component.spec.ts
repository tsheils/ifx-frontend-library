import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { EffectsModule } from "@ngrx/effects";
import { Store, StoreModule } from "@ngrx/store";

import { RdasBrowseComponent } from './rdas-browse.component';

describe('RdasBrowseComponent', () => {
  let component: RdasBrowseComponent;
  let fixture: ComponentFixture<RdasBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdasBrowseComponent ],
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

    fixture = TestBed.createComponent(RdasBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
