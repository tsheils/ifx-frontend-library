import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-ifx-header',
  imports: [
    CommonModule,
    MatToolbar,
    MatToolbarRow,
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './ifx-header.component.html',
  styleUrl: './ifx-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IfxHeaderComponent {
  title = input<string>();
}
