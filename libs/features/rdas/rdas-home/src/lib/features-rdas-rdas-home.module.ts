import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { SharedRdasRdasSearchModule } from "@ncats-frontend-library/shared/rdas/rdas-search";
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
    RouterModule.forChild(ROUTES),
    SharedRdasRdasSearchModule
  ],
  declarations: [
    RdasHomeComponent
  ],
})
export class FeaturesRdasRdasHomeModule {}
