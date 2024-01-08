import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ncats-frontend-library-unsubscribe-modal',
  templateUrl: './unsubscribe-modal.component.html',
  styleUrls: ['./unsubscribe-modal.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class UnsubscribeModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { entity: unknown; label?: string }
  ) {}
}
