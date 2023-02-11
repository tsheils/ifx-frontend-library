import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { SocialSignOnModalComponent } from './social-sign-on-modal/social-sign-on-modal.component';
import { SocialSignOnButtonComponent } from './social-sign-on-button/social-sign-on-button.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatIconModule,
    RouterModule,
    MatListModule
  ],
  declarations: [
    SocialSignOnModalComponent,
    SocialSignOnButtonComponent
  ],
  exports: [
    SocialSignOnButtonComponent
  ]
})
export class SharedSocialSignOnModule {}
