import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import {
  ArticleListCardComponent, ArticleListComponent

} from "@ncats-frontend-library/shared/rdas/article-display";
import { SharedRdasClinicalTrialsDisplayModule } from "@ncats-frontend-library/shared/rdas/clinical-trials-display";
import {
  ProjectListCardComponent,
  ProjectListComponent
} from "@ncats-frontend-library/shared/rdas/project-display";
import { SharedRdasSubscribeButtonModule } from "@ncats-frontend-library/shared/rdas/subscribe-button";
import { ExternalLinkComponent } from "@ncats-frontend-library/shared/utils/external-link";
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
    SharedRdasSubscribeButtonModule,
    SharedRdasClinicalTrialsDisplayModule,
    DiseaseListCardComponent,
    ArticleListCardComponent,
    ArticleListComponent,
    ProjectListComponent,
    ProjectListCardComponent,
    ExternalLinkComponent,
    MatIconModule
  ],
  declarations: [
    DiseaseDisplayComponent,
    DiseaseHeaderComponent,
    IdentifiersDisplayComponent,
    DiseaseListComponent
  ],
  exports: [
    DiseaseListComponent,
    DiseaseDisplayComponent
  ]
})
export class SharedRdasDiseaseDisplayModule {}
