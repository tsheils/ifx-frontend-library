import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatPaginatorModule } from "@angular/material/paginator";
import { RouterModule, Routes } from "@angular/router";
import { SharedRdasDiseaseDisplayModule } from "@ncats-frontend-library/shared/rdas/disease-display";
import { SharedRdasRdasSearchModule } from "@ncats-frontend-library/shared/rdas/rdas-search";
import { RdasBrowseComponent } from './rdas-browse/rdas-browse.component';


const ROUTES: Routes = [
  {
    path: '',
    component: RdasBrowseComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FlexLayoutModule,
    SharedRdasRdasSearchModule,
    SharedRdasDiseaseDisplayModule,
    MatPaginatorModule
  ],
  declarations: [
    RdasBrowseComponent
  ],
})
export class FeaturesRdasRdasBrowseModule {}
