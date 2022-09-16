import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
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
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    RdasDiseasePageComponent
  ],
})
export class FeaturesRdasRdasDiseasePageModule {}
