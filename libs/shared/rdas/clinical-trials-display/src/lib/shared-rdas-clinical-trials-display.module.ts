import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { ClinicalTrialsListComponent } from './clinical-trials-list/clinical-trials-list.component';
import { ClinicalTrialsListCardComponent } from './clinical-trials-list-card/clinical-trials-list-card.component';

@NgModule({
  imports: [CommonModule, MatCardModule, FlexLayoutModule],
  declarations: [
    ClinicalTrialsListComponent,
    ClinicalTrialsListCardComponent
  ],
})
export class SharedRdasClinicalTrialsDisplayModule {}
