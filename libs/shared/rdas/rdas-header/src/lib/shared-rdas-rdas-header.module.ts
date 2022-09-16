import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SharedUtilsLoadingSpinnerModule } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { RdasHeaderComponent } from './rdas-header/rdas-header.component';

@NgModule({
  imports: [CommonModule, SharedUtilsLoadingSpinnerModule, RouterModule],
  declarations: [
    RdasHeaderComponent
  ],
  exports: [
    RdasHeaderComponent
  ]
})
export class SharedRdasRdasHeaderModule {}
