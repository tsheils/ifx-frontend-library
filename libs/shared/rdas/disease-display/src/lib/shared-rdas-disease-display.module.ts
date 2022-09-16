import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { SharedRdasArticleDisplayModule } from "@ncats-frontend-library/shared/rdas/article-display";
import { SharedRdasClinicalTrialsDisplayModule } from "@ncats-frontend-library/shared/rdas/clinical-trials-display";
import { SharedRdasProjectDisplayModule } from "@ncats-frontend-library/shared/rdas/project-display";
import { SharedRdasSubscribeButtonModule } from "@ncats-frontend-library/shared/rdas/subscribe-button";
import { DiseaseDisplayComponent } from './disease-display/disease-display.component';
import { DiseaseHeaderComponent } from './disease-header/disease-header.component';
import { DiseaseListCardComponent } from "./disease-list-card/disease-list-card.component";
import { DiseaseListComponent } from "./disease-list/disease-list.component";
import { IdentifiersDisplayComponent } from './identifiers-display/identifiers-display.component';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    FlexLayoutModule,
    SharedRdasSubscribeButtonModule,
    SharedRdasProjectDisplayModule,
    SharedRdasArticleDisplayModule,
    SharedRdasClinicalTrialsDisplayModule
  ],
  declarations: [
    DiseaseDisplayComponent,
    DiseaseHeaderComponent,
    IdentifiersDisplayComponent,
    DiseaseListComponent,
    DiseaseListCardComponent
  ],
  exports: [
    DiseaseListComponent,
    DiseaseDisplayComponent
  ]
})
export class SharedRdasDiseaseDisplayModule {}
