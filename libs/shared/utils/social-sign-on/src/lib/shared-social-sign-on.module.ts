import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { SocialSignOnModalComponent } from './social-sign-on-modal/social-sign-on-modal.component';
import { SocialSignOnButtonComponent } from './social-sign-on-button/social-sign-on-button.component';
import { EmailSignOnModalComponent } from './email-sign-on-modal/email-sign-on-modal.component';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { ForgotPasswordModalComponent } from './forgot-password-modal/forgot-password-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatIconModule,
    RouterModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  declarations: [
    SocialSignOnModalComponent,
    SocialSignOnButtonComponent,
    EmailSignOnModalComponent,
    RegisterModalComponent,
    ForgotPasswordModalComponent,
  ],
  exports: [SocialSignOnButtonComponent],
})
export class SharedSocialSignOnModule {}
