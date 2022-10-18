import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { DiseaseListCardComponent } from "../disease-list-card/disease-list-card.component";
import { DiseaseHeaderComponent } from '../disease-header/disease-header.component';
import { IdentifiersDisplayComponent } from '../identifiers-display/identifiers-display.component';
import { SharedRdasSubscribeButtonModule } from "@ncats-frontend-library/shared/rdas/subscribe-button";

import { DiseaseListComponent } from './disease-list.component';

describe('DiseaseListComponent', () => {
  let component: DiseaseListComponent;
  let fixture: ComponentFixture<DiseaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseListComponent, DiseaseListCardComponent, DiseaseHeaderComponent, IdentifiersDisplayComponent ],
      imports: [
        MatCardModule,
        MatTabsModule,
        SharedRdasSubscribeButtonModule,StoreModule.forRoot(
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
        UsersFacade
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseListComponent);
    component = fixture.componentInstance;
    component.diseases=[new Disease({name: 'sdgsg', gard_id: 'bddfdf'})]
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
