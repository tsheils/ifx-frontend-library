import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailsComponent } from 'project-display';
import { Store } from '@ngrx/store';
import { ProjectSelectors } from 'project-store';

@Component({
  selector: 'lib-project-page',
  imports: [CommonModule, ProjectDetailsComponent],
  templateUrl: './rdas-project-page.component.html',
  styleUrls: ['./rdas-project-page.component.scss'],
})
export class RdasProjectPageComponent {
  private readonly projectStore = inject(Store);
  project = this.projectStore.selectSignal(ProjectSelectors.selectEntity);
}
