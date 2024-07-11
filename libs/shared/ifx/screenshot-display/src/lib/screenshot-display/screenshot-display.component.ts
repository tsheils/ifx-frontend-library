import { Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NCATSImage } from 'ifx';

@Component({
  selector: 'lib-screenshot-display',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgOptimizedImage],
  templateUrl: './screenshot-display.component.html',
  styleUrl: './screenshot-display.component.scss',
})
export class ScreenshotDisplayComponent {
  images = input<NCATSImage[]>();
}
