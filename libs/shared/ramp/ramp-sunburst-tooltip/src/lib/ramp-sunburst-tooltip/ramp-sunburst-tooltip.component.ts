import { Component, computed, inject, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SunburstChartService } from 'sunburst-chart';

export const SUNBURST_TOOLTIP = new InjectionToken<string>(
  'SunburstTooltipComponent',
);
@Component({
  selector: 'lib-ramp-sunburst-tooltip',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './ramp-sunburst-tooltip.component.html',
  styleUrl: './ramp-sunburst-tooltip.component.scss',
})
export class RampSunburstTooltipComponent {
  sunburstChartService = inject(SunburstChartService);
  hoveredNode = computed(() => this.sunburstChartService.reactionNode());
}
