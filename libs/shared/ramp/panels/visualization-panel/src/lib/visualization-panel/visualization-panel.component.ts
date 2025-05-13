import {
  ChangeDetectionStrategy,
  Component,
  computed, ElementRef,
  input,
  signal, viewChild,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { VisualizationMap } from '@ncats-frontend-library/models/utils';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { select } from 'd3-selection';
import { ImageDownloadComponent } from 'image-download';
import { SunburstChartComponent } from 'sunburst-chart';
import { TreeChartComponent } from 'tree-chart';
import { UpsetComponent } from 'upset-chart';
import { UtilsForceDirectedGraphComponent } from 'utils-force-directed-graph';

@Component({
  selector: 'lib-visualization-panel',
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
    ImageDownloadComponent
  ],
  templateUrl: './visualization-panel.component.html',
  styleUrl: './visualization-panel.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualizationPanelComponent {
  data = input<VisualizationMap[]>([]);
  chartElement =
    viewChild.required<ElementRef<HTMLInputElement>>('chartElement');
  activeChart = computed(() => this.writableChart() || this.data()[0].type);

  writableChart: WritableSignal<string | undefined> = signal(undefined);

  svgExport = computed(
      () => {
/*        console.log(this.chartElement())
        console.log(select(this.chartElement()!.nativeElement).select('svg'))
        console.log(select(this.chartElement()!.nativeElement).select('svg').node())*/
        return <SVGElement>(
          select(this.chartElement()!.nativeElement).select('svg').node()
        )
      }
    );
}
