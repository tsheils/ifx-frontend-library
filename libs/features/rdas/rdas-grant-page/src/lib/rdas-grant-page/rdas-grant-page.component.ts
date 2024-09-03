import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreProject } from '@ncats-frontend-library/models/rdas';
import { ProjectDetailsComponent } from '@ncats-frontend-library/shared/rdas/project-display';
import { Store } from '@ngrx/store';
import { GrantSelectors } from '@ncats-frontend-library/stores/grant-store';

@Component({
  selector: 'ncats-frontend-library-grant-page',
  standalone: true,
  imports: [CommonModule, ProjectDetailsComponent],
  templateUrl: './rdas-grant-page.component.html',
  styleUrls: ['./rdas-grant-page.component.scss'],
})
export class RdasGrantPageComponent {
  private readonly grantStore = inject(Store);
  grant = this.grantStore.selectSignal(GrantSelectors.selectEntity);
}
