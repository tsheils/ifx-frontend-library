import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import {
  LoginEmailUserActions,
  UserSelectors,
} from '@ncats-frontend-library/stores/user-store'
import { select, Store } from '@ngrx/store'
import { map } from 'rxjs'
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component'
import { RegisterModalComponent } from '../register-modal/register-modal.component'

import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'ncats-frontend-library-email-sign-on-modal',
  templateUrl: './email-sign-on-modal.component.html',
  styleUrls: ['./email-sign-on-modal.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailSignOnModalComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store)
  destroyRef = inject(DestroyRef)

  loginError = ''

  signOnForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    pw: new FormControl('', [Validators.required]),
  })

  constructor(
    public dialogRef: MatDialogRef<EmailSignOnModalComponent>,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.store
      .pipe(
        select(UserSelectors.getUsersError),
        takeUntilDestroyed(this.destroyRef),
        map((res: string | null | undefined) => {
          if (res) {
            this.loginError = res
          }
        })
      )
      .subscribe()

    this.store
      .pipe(
        select(UserSelectors.getUser),
        takeUntilDestroyed(this.destroyRef),
        map((res: unknown) => {
          if (res) {
            this.closeModal()
          }
        })
      )
      .subscribe()

    this.signOnForm.controls['pw'].valueChanges.subscribe(
      () => (this.loginError = '')
    )
  }

  getEmailErrorMessage() {
    if (this.signOnForm.controls['email'].hasError('required')) {
      return 'Email address required'
    }
    return this.signOnForm.controls['email'].hasError('email')
      ? 'Not a valid email'
      : ''
  }

  getPasswordErrorMessage() {
    if (this.signOnForm.controls['pw'].hasError('required')) {
      return 'Password required'
    }
    return ''
  }

  login() {
    this.loginError = ''
    if (this.signOnForm.valid) {
      this.store.dispatch(
        LoginEmailUserActions.loginEmailUser(this.signOnForm.value)
      )
    }
  }

  register() {
    this.dialog
      .open(RegisterModalComponent, {
        height: '55vh',
        width: '35vw',
      })
      .afterClosed()
      .subscribe(() => (this.loginError = ''))
  }

  forgotPassword() {
    this.loginError = ''
    this.dialog
      .open(ForgotPasswordModalComponent, {
        height: '55vh',
        width: '35vw',
      })
      .afterClosed()
      .subscribe(() => (this.loginError = ''))
  }

  closeModal(): void {
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.loginError = ''
  }
}
