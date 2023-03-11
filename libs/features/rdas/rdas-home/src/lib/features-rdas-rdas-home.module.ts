import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, Routes } from "@angular/router";
import { RdasSearchComponent } from "@ncats-frontend-library/shared/rdas/rdas-search";
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
    RdasSearchComponent,
    MatCardModule,
    MatIconModule
  ],
  declarations: [
    RdasHomeComponent
  ],
})
export class FeaturesRdasRdasHomeModule {}
