import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectListCardComponent } from './project-list-card/project-list-card.component';

@NgModule({
  imports: [CommonModule, MatPaginatorModule, FlexLayoutModule, MatCardModule],
  declarations: [
    ProjectListComponent,
    ProjectListCardComponent
  ],
  exports: [
    ProjectListComponent
  ]
})
export class SharedRdasProjectDisplayModule {}
