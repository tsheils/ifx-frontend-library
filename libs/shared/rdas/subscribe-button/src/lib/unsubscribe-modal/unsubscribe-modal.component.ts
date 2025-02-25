import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ncats-frontend-library-unsubscribe-modal',
  templateUrl: './unsubscribe-modal.component.html',
  styleUrls: ['./unsubscribe-modal.component.scss'],
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UnsubscribeModalComponent {
  public data = inject<{ entity: unknown; label?: string }>(MAT_DIALOG_DATA);
}
