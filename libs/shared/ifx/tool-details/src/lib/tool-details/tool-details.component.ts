import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Tool } from 'ifx';

@Component({
  selector: 'lib-tool-details',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './tool-details.component.html',
  styleUrl: './tool-details.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolDetailsComponent {
  tool = input<Tool>();
  imgSrcBase = computed(
    () =>
      '/assets/images/' +
      this.tool()?.toolName.toLowerCase().replace(/ /g, '-'),
  );
  imgSrc = computed(() => this.imgSrcBase() + '/primary.png');
}
