import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-ncats-header',
  imports: [
    CommonModule,
    MatToolbar,
    MatToolbarRow,
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './ncats-header.component.html',
  styleUrl: './ncats-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NcatsHeaderComponent {
  title = input<string>();
}
