import { Component, computed, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Tool } from 'ifx';

@Component({
  selector: 'lib-tool-card',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatCardModule,
    RouterLink,
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './tool-card.component.html',
  styleUrl: './tool-card.component.scss',
})
export class ToolCardComponent {
  tool = input<Tool>();
  imgSrcBase = computed(
    () =>
      '/assets/images/' +
      this.tool()?.toolName.toLowerCase().replace(/ /g, '-'),
  );
  imgSrc = computed(() => this.imgSrcBase() + '/primary.png');
}
