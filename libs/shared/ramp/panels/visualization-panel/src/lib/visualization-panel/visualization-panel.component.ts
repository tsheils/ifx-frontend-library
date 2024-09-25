import {
  Component,
  computed,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { GraphData } from '@ncats-frontend-library/models/utils';
import { SunburstChartComponent } from 'sunburst-chart';
import { TreeChartComponent } from 'tree-chart';
import { UtilsForceDirectedGraphComponent } from 'utils-force-directed-graph';

@Component({
  selector: 'lib-visualization-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatButton,
    SunburstChartComponent,
    TreeChartComponent,
    MatRadioButton,
    MatRadioGroup,
    UtilsForceDirectedGraphComponent
  ],
  templateUrl: './visualization-panel.component.html',
  styleUrl: './visualization-panel.component.scss',
})
export class VisualizationPanelComponent {
  data = input<
    {
      type: string;
      data: GraphData;
    }[]
  >([]);

  activeChart = computed(() => this.writableChart() || this.data()[0].type);

  writableChart: WritableSignal<string | undefined> = signal(undefined);

  downloadImage() {
    console.log('do this');
  }
}
