import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { SocialSignOnModalComponent } from './social-sign-on-modal/social-sign-on-modal.component';
import { SocialSignOnButtonComponent } from './social-sign-on-button/social-sign-on-button.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatIconModule
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
