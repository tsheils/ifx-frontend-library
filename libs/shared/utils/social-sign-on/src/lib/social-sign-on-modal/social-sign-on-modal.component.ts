import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsersFacade } from '@ncats-frontend-library/stores/user-store';
import { loginUser } from '@ncats-frontend-library/stores/user-store';
import { EmailSignOnModalComponent } from '../email-sign-on-modal/email-sign-on-modal.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ncats-frontend-library-social-sign-on-modal',
  templateUrl: './social-sign-on-modal.component.html',
  styleUrls: ['./social-sign-on-modal.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatListModule],
})
export class SocialSignOnModalComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  mobile = false;

  constructor(
    public dialogRef: MatDialogRef<SocialSignOnModalComponent>,
    private userFacade: UsersFacade,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private changeRef: ChangeDetectorRef
  ) {}

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
    this.userFacade.dispatch(loginUser({ provider: provider }));
  }
  /**
   * use firebase's email login methods
   */
  loginEmail() {
    this.dialog.open(EmailSignOnModalComponent, {
      height: '55vh',
      width: this.mobile ? '90vw' : '35vw',
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
