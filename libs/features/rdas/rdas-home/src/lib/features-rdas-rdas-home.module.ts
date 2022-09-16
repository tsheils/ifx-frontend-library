import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RdasHomeComponent } from './rdas-home/rdas-home.component';

const ROUTES: Routes = [
  {
    path: '',
    component: RdasHomeComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    RdasHomeComponent
  ],
})
export class FeaturesRdasRdasHomeModule {}
