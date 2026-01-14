import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailsComponent } from 'project-display';
import { Store } from '@ngrx/store';
import { ProjectSelectors } from 'grant-store';

@Component({
  selector: 'lib-grant-page',
  imports: [CommonModule, ProjectDetailsComponent],
  templateUrl: './rdas-grant-page.component.html',
  styleUrls: ['./rdas-grant-page.component.scss'],
})
export class RdasGrantPageComponent {
  private readonly projectStore = inject(Store);
  grant = this.projectStore.selectSignal(ProjectSelectors.selectEntity);
}
