import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { User } from '@ncats-frontend-library/models/utils';
import {
  UserLoginActions,
  UserSelectors,
} from '@ncats-frontend-library/stores/user-store';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { SocialSignOnModalComponent } from '../social-sign-on-modal/social-sign-on-modal.component';

@Component({
  selector: 'ncats-frontend-library-social-sign-on-button',
  templateUrl: './social-sign-on-button.component.html',
  styleUrls: ['./social-sign-on-button.component.scss'],
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatDialogModule,
  ],
})
//, OnChanges
export class SocialSignOnButtonComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  store = inject(Store);
  mobile = false;

  /**
   * profile object
   */
  user!: User;

  @Input() theme = 'primary';

  constructor(
    public dialog: MatDialog,
    public ref: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private changeRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });

    this.store
      .select(UserSelectors.getUser)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((user: User) => {
          this.user = user;
          if (user) {
            this.dialog.closeAll();
            // this.ref.markForCheck();
          }
        }),
      )
      .subscribe();
  }

  /**
   * opens modal for user to sign in
   */
  openSignInModal() {
    this.dialog.open(SocialSignOnModalComponent, {
      height: '45vh',
      width: this.mobile ? '90vw' : '35vw',
    });
  }

  /**
   * sign out user
   */
  signOut(): void {
    this.store.dispatch(UserLoginActions.logoutUser());
  }
}
