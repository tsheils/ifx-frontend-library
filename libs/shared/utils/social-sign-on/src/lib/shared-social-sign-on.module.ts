import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { SocialSignOnModalComponent } from './social-sign-on-modal/social-sign-on-modal.component';
import { SocialSignOnButtonComponent } from './social-sign-on-button/social-sign-on-button.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, MatButtonModule],
  declarations: [

    SocialSignOnModalComponent,
       SocialSignOnButtonComponent
  ],
})
export class SharedSocialSignOnModule {}
