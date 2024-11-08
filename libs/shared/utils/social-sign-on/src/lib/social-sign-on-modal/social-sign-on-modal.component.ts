import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRippleModule } from '@angular/material/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserLoginActions } from '@ncats-frontend-library/stores/user-store';
import { Store } from '@ngrx/store';
import { EmailSignOnModalComponent } from '../email-sign-on-modal/email-sign-on-modal.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ncats-frontend-library-social-sign-on-modal',
  templateUrl: './social-sign-on-modal.component.html',
  styleUrls: ['./social-sign-on-modal.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatRippleModule,
    MatDialogActions,
    MatDialogContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialSignOnModalComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  store = inject(Store);
  dialogRef = inject(MatDialogRef<SocialSignOnModalComponent>);
  public dialog = inject(MatDialog);
  private breakpointObserver = inject(BreakpointObserver);
  private changeRef = inject(ChangeDetectorRef);

  mobile = false;

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });
  }

  login(provider: string): void {
    this.store.dispatch(UserLoginActions.loginUser({ provider: provider }));
  }
  /**
   * use firebase's email login methods
   */
  loginEmail() {
    this.dialog
      .open(EmailSignOnModalComponent, {
        height: '55vh',
        width: this.mobile ? '90vw' : '35vw',
      })
      .afterClosed()
      .subscribe(() => this.closeModal());
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
