import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SubscribeButtonComponent } from './subscribe-button/subscribe-button.component';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';

@NgModule({
  imports: [CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule, MatMenuModule, MatIconModule, MatCheckboxModule
  ],
  declarations: [
    SubscribeButtonComponent,
    UnsubscribeModalComponent
  ],
  exports: [
    SubscribeButtonComponent
  ]
})
export class SharedRdasSubscribeButtonModule {}
