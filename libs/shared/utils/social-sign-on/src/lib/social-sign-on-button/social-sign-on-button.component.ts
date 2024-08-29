import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { UserLoginActions, UserSelectors } from '@ncats-frontend-library/stores/user-store';
import { Store } from '@ngrx/store';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
//, OnChanges
export class SocialSignOnButtonComponent implements OnInit {
  private readonly store = inject(Store);
  destroyRef = inject(DestroyRef);
  public dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private changeRef = inject(ChangeDetectorRef);
  private breakpointObserver = inject(BreakpointObserver);
  user = this.store.selectSignal(UserSelectors.getUser);

  mobile = false;

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });

    /*this.store
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
      .subscribe();*/
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
