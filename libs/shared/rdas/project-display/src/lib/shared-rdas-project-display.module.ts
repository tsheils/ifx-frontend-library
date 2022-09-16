import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectListCardComponent } from './project-list-card/project-list-card.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ProjectListComponent,
    ProjectListCardComponent
  ],
})
export class SharedRdasProjectDisplayModule {}
