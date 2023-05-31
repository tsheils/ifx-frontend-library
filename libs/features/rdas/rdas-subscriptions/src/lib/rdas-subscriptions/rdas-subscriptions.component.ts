import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription, User } from "@ncats-frontend-library/models/utils";
import { UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { Subject, takeUntil } from "rxjs";
import { DiseaseSubscriptionListComponent } from "../../../../../../shared/rdas/disease-display/src/lib/disease-subscription-list/disease-subscription-list.component";

@Component({
    selector: 'ncats-frontend-library-rdas-subscriptions',
    templateUrl: './rdas-subscriptions.component.html',
    styleUrls: ['./rdas-subscriptions.component.scss'],
    standalone: true,
    imports: [DiseaseSubscriptionListComponent],
})
export class RdasSubscriptionsComponent implements OnInit, OnDestroy {
  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<boolean> = new Subject();
  subscriptions: Subscription[] = [];
  loading = true;


  constructor(
    private userFacade: UsersFacade,
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userFacade.user$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(userArr => {
        if (userArr && userArr.length) {
          const user: User = JSON.parse(JSON.stringify(userArr[0]));
          this.subscriptions = user?.subscriptions;
          this.loading = false;
          this.changeRef.markForCheck();
        }
      })
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
