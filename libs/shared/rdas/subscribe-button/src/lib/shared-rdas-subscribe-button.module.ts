import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedSocialSignOnModule } from "@ncats-frontend-library/shared/utils/social-sign-on";
import { SubscribeButtonComponent } from './subscribe-button/subscribe-button.component';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';
import { AboutSubscribeModalComponent } from './about-subscribe-modal/about-subscribe-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    SharedSocialSignOnModule
  ],
  declarations: [
    SubscribeButtonComponent,
    UnsubscribeModalComponent,
    AboutSubscribeModalComponent
  ],
  exports: [SubscribeButtonComponent],
})
export class SharedRdasSubscribeButtonModule {}
