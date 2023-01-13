import { SelectionModel } from "@angular/cdk/collections";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { Subscription, User } from "@ncats-frontend-library/models/utils";
import { updateUserSubscriptions, UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";
import { UnsubscribeModalComponent } from "../unsubscribe-modal/unsubscribe-modal.component";

@Component({
  selector: 'ncats-frontend-library-subscribe-button',
  templateUrl: './subscribe-button.component.html',
  styleUrls: ['./subscribe-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscribeButtonComponent implements OnInit, OnDestroy {
  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<boolean> = new Subject();

  @Input() disease!: Disease;
  @Input() subscribed = false;
  private user: User | null = null;
  subscription?: Subscription;

  all = ['articles', 'grants', 'trials'];

  subscriptionSelection = new SelectionModel<string>(true, this.all);


  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private userFacade: UsersFacade,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userFacade.user$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(user => {
      if(user && user.length) {
        this.user = JSON.parse(JSON.stringify(user[0]));
        this.subscription = this.user?.subscriptions.filter(sub => sub.gardID === this.disease.gardId)[0];
          this.subscribed = !!this.subscription;
          this.changeRef.markForCheck();
        if (this.subscription?.alerts) {
          this.subscriptionSelection.setSelection(...this.subscription.alerts);
        }
      } else {
        this.user = null;
        this.subscription = undefined;
        this.subscribed = false;
        this.changeRef.markForCheck();
      }
    })

    this.subscriptionSelection.changed
      .pipe(
      takeUntil(this.ngUnsubscribe),
      debounceTime(1000),
      distinctUntilChanged()
      )
      .subscribe(() => {
        const subscriptionClone: Subscription[] = [];
        if (this.user && this.user.subscriptions) {
          this.user?.subscriptions.forEach(sub => subscriptionClone.push(sub))
          subscriptionClone.splice(this.user.subscriptions.findIndex(obj => obj.gardID === this.disease.gardId), 1);
          this.subscription = { diseaseName: this.disease.name, gardID: this.disease.gardId, alerts: this.subscriptionSelection.selected };
          subscriptionClone.push(this.subscription);
          this.userFacade.dispatch(updateUserSubscriptions({ subscriptions: subscriptionClone }))
        }
      });
  }

  subscribe(){
    if(this.user) {
      this.subscription = {diseaseName: this.disease.name, gardID: this.disease.gardId, alerts: this.all};
      const subscriptionClone: Subscription[] = [this.subscription];
      this.user.subscriptions.forEach(sub => subscriptionClone.push(sub))
      this.userFacade.dispatch(updateUserSubscriptions({subscriptions: subscriptionClone}))
      this._snackBar.open('Subscription updated',undefined,{
        duration: 3000
      })
    } else {
    //  alert("sign in, pal")
   }
  }

  unSubscribe(){
    this.dialog.open(UnsubscribeModalComponent, {data:{entity: this.disease, label: this.disease.name}}).afterClosed()
      .subscribe(
        (res: { [key: string]: string }) => {
          if(res) {
            const subscriptionClone: Subscription[] = [];
            this.user?.subscriptions.forEach(sub => {
              if(sub.gardID !== this.disease.gardId) {
                subscriptionClone.push(Object.assign({}, {...sub}))
              }
            })
            this.userFacade.dispatch(updateUserSubscriptions({subscriptions: subscriptionClone}))
            this._snackBar.open('Subscription removed',undefined,{
              duration: 3000
            })
          }
        });
  }

  toggleAll() {
    if(this.subscriptionSelection.selected.length === 3) {
      this.subscriptionSelection.clear()
    } else {
      this.subscriptionSelection.select(...this.all);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}

