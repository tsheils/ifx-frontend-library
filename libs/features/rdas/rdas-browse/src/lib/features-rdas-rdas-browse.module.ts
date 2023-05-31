import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from "@angular/material/paginator";
import { RouterModule, Routes } from "@angular/router";

import { RdasSearchComponent } from "@ncats-frontend-library/shared/rdas/rdas-search";
import { RdasTreeComponent } from "@ncats-frontend-library/shared/rdas/rdas-tree";

import { ScrollToTopComponent } from "@ncats-frontend-library/shared/utils/scroll-to-top";
import { RdasBrowseComponent } from './rdas-browse/rdas-browse.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: RdasBrowseComponent,
  },
];

@NgModule({
    imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
],
})
