import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedRdasRdasSearchModule } from "@ncats-frontend-library/shared/rdas/rdas-search";
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { EffectsModule } from "@ngrx/effects";
import { Store, StoreModule } from "@ngrx/store";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

import { RdasHomeComponent } from './rdas-home.component';

describe('RdasHomeComponent', () => {
  let component: RdasHomeComponent;
  let fixture: ComponentFixture<RdasHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdasHomeComponent ],
      imports: [
        SharedRdasRdasSearchModule,
        ApolloTestingModule,
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
        Apollo,
        DiseasesFacade,
  ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RdasHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
