import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, User } from '@ncats-frontend-library/models/utils';
import { SocialSignOnButtonComponent } from '@ncats-frontend-library/shared/utils/social-sign-on';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { AboutSubscribeModalComponent } from '../about-subscribe-modal/about-subscribe-modal.component';
import { UnsubscribeModalComponent } from '../unsubscribe-modal/unsubscribe-modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import {
  UpdateUserActions,
  UserSelectors,
} from '@ncats-frontend-library/stores/user-store';

@Component({
  selector: 'ncats-frontend-library-subscribe-button',
  templateUrl: './subscribe-button.component.html',
  styleUrls: ['./subscribe-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    SocialSignOnButtonComponent,
  ],
})
export class SubscribeButtonComponent implements OnInit, OnDestroy {
  private readonly userStore = inject(Store);
  destroyRef = inject(DestroyRef);

  @Input() subscriptionName!: string | undefined;
  @Input() subscriptionId!: string | undefined;
  @Input() subscribed = false;
  @Input() theme = 'primary';
  @Output() userChange: EventEmitter<User | null> =
    new EventEmitter<User | null>();
  @Output() isSubscribed: EventEmitter<boolean> = new EventEmitter<boolean>();
  mobile = false;
  user!: User;
  subscription?: Subscription;
  userExists = false;

  all = ['articles', 'grants', 'trials'];

  subscriptionSelection = new SelectionModel<string>(true, this.all);

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private changeRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });

    this.userStore
      .select(UserSelectors.getUser)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((user: User) => {
          this.user = user;
          this.setSubscriptions();
          this.changeRef.markForCheck();
          if (user) {
            //  this.userExists = true;
            //  this.changeRef.markForCheck();
            this.userChange.emit(this.user);
            this.isSubscribed.emit(this.subscribed);
          }
        }),
      )
      .subscribe();

    this.subscriptionSelection.changed
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        const subscriptionClone: Subscription[] = [];
        if (this.user && this.user.subscriptions) {
          this.user?.subscriptions.forEach((sub) =>
            subscriptionClone.push(sub),
          );
          subscriptionClone.splice(
            this.user.subscriptions.findIndex(
              (obj) => obj.gardID === this.subscriptionId,
            ),
            1,
          );
          this.subscription = new Subscription({
            diseaseName: this.subscriptionName,
            gardID: this.subscriptionId,
            alerts: this.subscriptionSelection.selected,
          });
          subscriptionClone.push(this.subscription);
          this.userStore.dispatch(
            UpdateUserActions.updateUserSubscriptions({
              subscriptions: subscriptionClone,
            }),
          );
        }
      });
  }

  setSubscriptions() {
    if (this.user) {
      this.subscription = this.user?.subscriptions?.filter(
        (sub: Subscription) => sub.gardID == this.subscriptionId,
      )[0];
      this.subscribed = !!this.subscription;
      if (this.subscription?.alerts) {
        this.subscriptionSelection.setSelection(...this.subscription.alerts);
      }
    } else {
      //  this.user = undefined;
      //   this.userExists = false;
      this.subscription = undefined;
      this.subscribed = false;
    }
  }

  subscribe() {
    if (this.user) {
      this.subscription = new Subscription({
        diseaseName: this.subscriptionName,
        gardID: this.subscriptionId,
        alerts: this.all,
      });
      const subscriptionClone: Subscription[] = [{ ...this.subscription }];
      this.user.subscriptions.forEach((sub) => subscriptionClone.push(sub));
      this.userStore.dispatch(
        UpdateUserActions.updateUserSubscriptions({
          subscriptions: subscriptionClone,
        }),
      );
      this._snackBar.open('Subscription updated', '', {
        duration: 3000,
      });
    } else {
      //  alert("sign in, pal")
    }
  }

  unSubscribe() {
    this.dialog
      .open(UnsubscribeModalComponent, {
        data: {
          entity: this.subscriptionId,
          label: this.subscriptionName,
        },
      })
      .afterClosed()
      .subscribe((res: { [key: string]: string }) => {
        if (res) {
          const subscriptionClone: Subscription[] = [];
          this.user?.subscriptions.forEach((sub) => {
            if (sub.gardID !== this.subscriptionId) {
              subscriptionClone.push(Object.assign({}, { ...sub }));
            }
          });
          this.userStore.dispatch(
            UpdateUserActions.updateUserSubscriptions({
              subscriptions: subscriptionClone,
            }),
          );
          this._snackBar.open('Subscription removed', '', {
            duration: 3000,
          });
        }
      });
  }

  aboutSubscribe() {
    this.dialog.open(AboutSubscribeModalComponent, {
      width: this.mobile ? '90vw' : '35vw',
    });
  }

  toggleAll() {
    if (this.subscriptionSelection.selected.length === 3) {
      this.subscriptionSelection.clear();
    } else {
      this.subscriptionSelection.select(...this.all);
    }
  }

  ngOnDestroy() {
    this.userExists = false;
  }
}
