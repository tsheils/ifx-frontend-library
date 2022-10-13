import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { Disease } from "@ncats-frontend-library/models/rdas";
import {
  DiseaseHeaderComponent,
  IdentifiersDisplayComponent
} from "@ncats-frontend-library/shared/rdas/disease-display";
import { SharedRdasSubscribeButtonModule } from "@ncats-frontend-library/shared/rdas/subscribe-button";

import { DiseaseListComponent } from './disease-list.component';

describe('DiseaseListComponent', () => {
  let component: DiseaseListComponent;
  let fixture: ComponentFixture<DiseaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseListComponent, DiseaseHeaderComponent, IdentifiersDisplayComponent ],
      imports: [
        MatCardModule,
        MatTabsModule,
        SharedRdasSubscribeButtonModule
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
