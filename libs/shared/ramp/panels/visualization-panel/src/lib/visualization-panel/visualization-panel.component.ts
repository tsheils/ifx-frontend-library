import {
  ChangeDetectionStrategy,
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
import { VisualizationMap } from 'panel-accordion';
import { SunburstChartComponent } from 'sunburst-chart';
import { TreeChartComponent } from 'tree-chart';
import { UpsetComponent } from 'upset-chart';
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
    UtilsForceDirectedGraphComponent,
    UpsetComponent,
  ],
  templateUrl: './visualization-panel.component.html',
  styleUrl: './visualization-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualizationPanelComponent {
  data = input<VisualizationMap[]>([]);

  activeChart = computed(() => this.writableChart() || this.data()[0].type);

  writableChart: WritableSignal<string | undefined> = signal(undefined);

  downloadImage() {
    console.log('do this');
  }
}
