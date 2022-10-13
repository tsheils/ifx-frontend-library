import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from "@angular/material/tabs";
import {
  DiseaseHeaderComponent,
  IdentifiersDisplayComponent
} from "@ncats-frontend-library/shared/rdas/disease-display";
import { SharedUtilsHeaderTemplateModule } from "@ncats-frontend-library/shared/utils/header-template";

import { DiseaseDisplayComponent } from './disease-display.component';

describe('DiseaseDisplayComponent', () => {
  let component: DiseaseDisplayComponent;
  let fixture: ComponentFixture<DiseaseDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DiseaseDisplayComponent,
        DiseaseHeaderComponent,
        IdentifiersDisplayComponent
      ],
      imports: [
        MatTabsModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
