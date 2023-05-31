import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";

import { ScrollToTopComponent } from "@ncats-frontend-library/shared/utils/scroll-to-top";

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
    ScrollToTopComponent,
    RdasDiseasePageComponent
],
})
export class FeaturesRdasRdasDiseasePageModule {}
