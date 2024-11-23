import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetailsComponent } from '@ncats-frontend-library/shared/rdas/project-display';
import { Store } from '@ngrx/store';
import { ProjectSelectors } from '@ncats-frontend-library/stores/grant-store';

@Component({
  selector: 'ncats-frontend-library-grant-page',
  standalone: true,
  imports: [CommonModule, ProjectDetailsComponent],
  templateUrl: './rdas-grant-page.component.html',
  styleUrls: ['./rdas-grant-page.component.scss'],
})
export class RdasGrantPageComponent {
  private readonly projectStore = inject(Store);
  grant = this.projectStore.selectSignal(ProjectSelectors.selectEntity);
}
