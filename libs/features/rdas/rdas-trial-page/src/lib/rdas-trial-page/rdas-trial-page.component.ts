import { ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ClinicalTrial } from '@ncats-frontend-library/models/rdas';
import { ClinicalTrialsDetailsComponent } from '@ncats-frontend-library/shared/rdas/clinical-trials-display';
import { Store } from "@ngrx/store";
import { TrialSelectors } from "@ncats-frontend-library/stores/trial-store";



@Component({
  selector: 'ncats-frontend-library-trial-page',
  standalone: true,
  imports: [CommonModule, ClinicalTrialsDetailsComponent],
  templateUrl: './rdas-trial-page.component.html',
  styleUrls: ['./rdas-trial-page.component.scss'],
})
export class RdasTrialPageComponent implements OnInit {
  private readonly trialStore = inject(Store);
  destroyRef = inject(DestroyRef);

  @Input() trial!: ClinicalTrial;

  constructor(
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.trialStore.select(TrialSelectors.selectEntity).subscribe((res) => {
      if (res) {
        this.trial = res;
        this.changeRef.markForCheck();
      }
    });
  }
}
