import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTabsModule } from "@angular/material/tabs";
import { ClinicalTrialsListComponent } from './clinical-trials-list/clinical-trials-list.component';
import { ClinicalTrialsListCardComponent } from './clinical-trials-list-card/clinical-trials-list-card.component';

@NgModule({
  imports: [CommonModule, MatCardModule, FlexLayoutModule, MatPaginatorModule, MatTabsModule, MatListModule],
  declarations: [
    ClinicalTrialsListComponent,
    ClinicalTrialsListCardComponent
  ],
  exports: [
    ClinicalTrialsListComponent
  ]
})
export class SharedRdasClinicalTrialsDisplayModule {}
