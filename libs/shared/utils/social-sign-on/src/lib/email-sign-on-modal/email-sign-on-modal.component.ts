import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { loginEmailUser, UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { ForgotPasswordModalComponent } from "../forgot-password-modal/forgot-password-modal.component";
import { RegisterModalComponent } from "../register-modal/register-modal.component";
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'ncats-frontend-library-email-sign-on-modal',
    templateUrl: './email-sign-on-modal.component.html',
    styleUrls: ['./email-sign-on-modal.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NgIf,
    ],
})
export class EmailSignOnModalComponent {
  loginError = '';

  signOnForm: FormGroup = new FormGroup<any>({
    email:  new FormControl('', [Validators.required,Validators.email]),
    pw:  new FormControl('', [Validators.required]),
  })

  constructor(
    public dialogRef: MatDialogRef<EmailSignOnModalComponent>,
    private userFacade: UsersFacade,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.userFacade.error$.subscribe(err => {
      if(err) {
        this.loginError = err;
      }
      console.log(err)
    })

    this.signOnForm.controls['pw'].valueChanges.subscribe(() => this.loginError = '')
  }

  getEmailErrorMessage() {
    if (this.signOnForm.controls["email"].hasError('required')) {
      return 'Email address required';
    }
    return this.signOnForm.controls["email"].hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.signOnForm.controls["pw"].hasError('required')) {
      return 'Password required';
    }
    return '';
  }

login() {
    this.loginError = '';
  if(this.signOnForm.valid) {
    this.userFacade.dispatch(loginEmailUser(this.signOnForm.value));
  }
}

register() {
    this.dialog.open(RegisterModalComponent, {
        height: '55vh',
        width: '35vw',
      }
    ).afterClosed().subscribe(() =>  this.loginError = '');
}

forgotPassword() {
  this.loginError = '';
  this.dialog.open(ForgotPasswordModalComponent, {
      height: '55vh',
      width: '35vw',
    }
  ).afterClosed().subscribe(() =>  this.loginError = '');
}

  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.loginError = '';
  }

}
