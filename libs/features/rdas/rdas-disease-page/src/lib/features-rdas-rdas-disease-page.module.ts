import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { SharedRdasDiseaseDisplayModule } from "@ncats-frontend-library/shared/rdas/disease-display";
import { RdasDiseasePageComponent } from './rdas-disease-page/rdas-disease-page.component';

const ROUTES: Routes = [
  {
    path: '',
    component: RdasDiseasePageComponent,
  },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    SharedRdasDiseaseDisplayModule
  ],
  declarations: [
    RdasDiseasePageComponent
  ],
})
export class FeaturesRdasRdasDiseasePageModule {}
