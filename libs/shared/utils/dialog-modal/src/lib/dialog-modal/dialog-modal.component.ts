import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'lib-dialog-modal',
  imports: [CommonModule, MatIcon, MatRipple, MatDialogContent, MatDialogTitle, MatButton, MatDialogClose, MatDialogActions],
  templateUrl: './dialog-modal.component.html',
  styleUrl: './dialog-modal.component.scss',
  standalone: true
})
export class DialogModalComponent {
  readonly data: {
    title: string;
    message?: string;
    htmlString?: SafeHtml;
  } = inject(MAT_DIALOG_DATA);
  readonly dialogRef: MatDialogRef<DialogModalComponent> = inject(
    MatDialogRef<DialogModalComponent>
  );

  close(tab?: number): void {
    this.dialogRef.close(tab);
  }
}
