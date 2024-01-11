import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { User } from '@ncats-frontend-library/models/utils';
import {
  fetchDiseaseList,
  DiseasesFacade,
} from '@ncats-frontend-library/stores/disease-store';
import { UsersFacade } from '@ncats-frontend-library/stores/user-store';
import { Subject, takeUntil } from 'rxjs';
import { DiseaseListComponent } from '@ncats-frontend-library/shared/rdas/disease-display';

@Component({
  selector: 'ncats-frontend-library-rdas-subscriptions',
  templateUrl: './rdas-subscriptions.component.html',
  styleUrls: ['./rdas-subscriptions.component.scss'],
  standalone: true,
  imports: [DiseaseListComponent],
})
export class RdasSubscriptionsComponent implements OnInit, OnDestroy {
  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<boolean> = new Subject();
  subscriptions!: Signal<Disease[] | undefined>;
  loading = true;

  constructor(
    private userFacade: UsersFacade,
    private diseaseFacade: DiseasesFacade,
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userFacade.user$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userArr) => {
        if (userArr && userArr.length) {
          const user: User = JSON.parse(JSON.stringify(userArr[0]));
          if (user && user.subscriptions) {
            const ids: string[] = user.subscriptions.map((sub) => sub.gardID);
            this.diseaseFacade.dispatch(fetchDiseaseList({ gardIds: ids }));
          }
          //   this.subscriptions = user?.subscriptions;
          this.loading = false;
          this.changeRef.markForCheck();
        }
      });

    this.subscriptions = this.diseaseFacade.subscribedDiseases$;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
