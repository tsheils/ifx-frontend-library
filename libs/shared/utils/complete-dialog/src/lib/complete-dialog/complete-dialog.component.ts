import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'lib-complete-dialog',
  standalone: true,
  imports: [CommonModule, MatIcon, MatDialogContent, MatRipple],
  templateUrl: './complete-dialog.component.html',
  styleUrl: './complete-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteDialogComponent {
  readonly data: {
    title?: string;
    message?: string;
  } = inject(MAT_DIALOG_DATA);
  readonly dialogRef: MatDialogRef<CompleteDialogComponent> = inject(
    MatDialogRef<CompleteDialogComponent>,
  );

  close(tab?: number): void {
    this.dialogRef.close(tab);
  }
}
