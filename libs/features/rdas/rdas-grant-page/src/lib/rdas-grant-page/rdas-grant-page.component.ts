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
export class RdasGrantPageComponent implements OnInit {
  private readonly grantStore = inject(Store);
  destroyRef = inject(DestroyRef);
  @Input() grant!: CoreProject;

  constructor(private changeRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.grantStore.select(GrantSelectors.selectEntity).subscribe((res) => {
      if (res) {
        this.grant = res;
        this.changeRef.markForCheck();
      }
    });
  }
}
