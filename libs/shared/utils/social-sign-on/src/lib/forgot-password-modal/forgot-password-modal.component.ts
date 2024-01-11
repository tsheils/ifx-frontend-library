import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  resetPasswordEmail,
  UsersFacade,
} from '@ncats-frontend-library/stores/user-store';
import { MatCardModule } from '@angular/material/card';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ncats-frontend-library-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
})
export class ForgotPasswordModalComponent implements OnInit, OnDestroy {
  loginError = '';
  emailSent = false;

  signOnForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordModalComponent>,
    private userFacade: UsersFacade,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userFacade.error$.subscribe((err) => {
      if (err) {
        this.loginError = err;
      }
      console.log(err);
    });

    this.userFacade.email$.subscribe((res) => {
      if (res === 'reset') {
        this.emailSent = true;
        this.signOnForm.reset();
      }
    });
  }
  getEmailErrorMessage() {
    if (this.signOnForm.controls['email'].hasError('required')) {
      return 'Email address required';
    }
    return this.signOnForm.controls['email'].hasError('email')
      ? 'Not a valid email'
      : '';
  }

  send() {
    if (this.signOnForm.valid) {
      this.userFacade.dispatch(resetPasswordEmail(this.signOnForm.value));
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.loginError = '';
  }
}
