import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { User } from '@ncats-frontend-library/models/utils';
import { FetchDiseaseListActions } from '@ncats-frontend-library/stores/disease-store';
import { DiseaseListCardComponent } from '@ncats-frontend-library/shared/rdas/disease-display';
import { DiseaseSelectors } from '@ncats-frontend-library/stores/disease-store';
import { UserSelectors } from '@ncats-frontend-library/stores/user-store';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs';

@Component({
  selector: 'ncats-frontend-library-rdas-subscriptions',
  templateUrl: './rdas-subscriptions.component.html',
  styleUrls: ['./rdas-subscriptions.component.scss'],
  imports: [DiseaseListCardComponent],
  standalone: true,
})
export class RdasSubscriptionsComponent implements OnInit {
  private readonly store = inject(Store);
  destroyRef = inject(DestroyRef);

  subscriptions!: Signal<Disease[] | undefined>;
  loading = true;

  constructor(private changeRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.store
      .pipe(
        select(UserSelectors.getSelected),
        takeUntilDestroyed(this.destroyRef),
        map((user: User | undefined) => {
          if (user) {
            if (user && user.subscriptions) {
              const ids: string[] = user.subscriptions.map((sub) => sub.gardID);
              this.store.dispatch(
                FetchDiseaseListActions.fetchDiseaseList({ gardIds: ids })
              );
            }
            //   this.subscriptions = user?.subscriptions;
            this.loading = false;
            this.changeRef.markForCheck();
          }
        })
      )
      .subscribe();

    this.subscriptions = this.store.selectSignal(
      DiseaseSelectors.getDiseasesSubscriptions
    );
  }
}
