import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { User } from '@ncats-frontend-library/models/utils';
import {
  UsersFacade,
  logoutUser,
} from '@ncats-frontend-library/stores/user-store';
import { Subject } from 'rxjs';
import { SocialSignOnModalComponent } from '../social-sign-on-modal/social-sign-on-modal.component';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf } from '@angular/common';

@Component({
  selector: 'ncats-frontend-library-social-sign-on-button',
  templateUrl: './social-sign-on-button.component.html',
  styleUrls: ['./social-sign-on-button.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatDialogModule,
  ],
})
export class SocialSignOnButtonComponent
  implements OnInit, OnChanges, OnDestroy
{
  destroyRef = inject(DestroyRef);
  mobile = false;
  protected ngUnsubscribe: Subject<boolean> = new Subject();

  /**
   * profile object
   */
  @Input()
  user?: User;

  photoURL = '';
  @Input() theme = 'primary';

  constructor(
    public dialog: MatDialog,
    public ref: ChangeDetectorRef,
    private userFacade: UsersFacade,
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

  ngOnChanges(change: SimpleChanges) {
    if (change['user'] && !change['user'].firstChange) {
      if (this.user?.photoURL) {
        this.photoURL = this.user.photoURL;
      }
      this.dialog.closeAll();
      this.ref.detectChanges();
    }
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
    this.userFacade.dispatch(logoutUser());
  }

  viewProfile() {
    //todo
  }

  handleMissingImage() {
    this.photoURL = '';
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
