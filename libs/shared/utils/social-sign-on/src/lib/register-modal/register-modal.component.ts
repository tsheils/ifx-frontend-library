import { Component, ViewEncapsulation } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { registerEmailUser, UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { map } from "rxjs";
import { NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

/**
 * Set the regular expression for a secure password
 */
  export function securePassword() : ValidatorFn  {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  return (control: AbstractControl): { isSecure:{value: string} } | null => {
    const isSecure = passwordRegex.test(control.value);
    return isSecure ? null : { isSecure: { value: control.value } } ;
  };
}

/**
 * Set the regular expression for a secure password
 */
  export function matchPassword(testInput: AbstractControl) : ValidatorFn  {
  return (control: AbstractControl): { passwordsMatch:{value: string} } | null => {
    const matching = control.value === testInput.value;
    return matching ? null : { passwordsMatch: { value: control.value } } ;
  };
}

@Component({
    selector: 'ncats-frontend-library-register-modal',
    templateUrl: './register-modal.component.html',
    styleUrls: ['./register-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf]
})
export class RegisterModalComponent {

    showPassword = false;
    inputType = 'password';

  registerForm: FormGroup = new FormGroup<any>({
    email:  new FormControl('', [Validators.required,Validators.email]),
    pw:  new FormControl('', [Validators.required, securePassword()]),
    pwVerify: new FormControl('', [Validators.required, securePassword()])
  })

  constructor(
    public dialogRef: MatDialogRef<RegisterModalComponent>,
    private userFacade: UsersFacade,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() : void {
  //  this.registerForm.controls['pw'].addValidators(matchPassword(this.registerForm.controls['pwVerify']))
    this.registerForm.controls['pwVerify'].addValidators(matchPassword(this.registerForm.controls['pw']))
}


  getEmailErrorMessage() {
    if (this.registerForm.controls["email"].hasError('required')) {
      return 'Email address required';
    }
    return this.registerForm.controls["email"].hasError('email') ? 'Not a valid email' : '';
  }

  getPasswordErrorMessage() {
    if (this.registerForm.controls["pw"].hasError('required')) {
      return 'Password required';
    }
    if(this.registerForm.controls["pw"].hasError('isSecure')) {
      return 'Password must be at least: 6 chars, 1 number, 1 uppercase';
    }

    if(this.registerForm.controls["pw"].hasError('passwordsMatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  getPasswordVerifyErrorMessage() {
    if (this.registerForm.controls["pwVerify"].hasError('required')) {
      return 'Please re-enter password';
    }
    if(this.registerForm.controls["pwVerify"].hasError('passwordsMatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

register() {
if(this.registerForm.status === "VALID") {
  this.userFacade.dispatch(registerEmailUser(this.registerForm.value))
}

}

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.inputType = this.showPassword ? 'text' : 'password';
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}
