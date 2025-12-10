import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { IfxDatatableComponent } from 'ifx-datatable';
import { GraphNode } from 'utils-models';
import { ForceDirectedGraphService } from 'utils-force-directed-graph';

export const GRAPH_LEGEND = new InjectionToken<string>(
  'RampGraphLegendComponent'
);

@Component({
  selector: 'lib-ramp-graph-legend',
  imports: [CommonModule, MatExpansionModule, IfxDatatableComponent],
  templateUrl: './ramp-graph-legend.component.html',
  styleUrl: './ramp-graph-legend.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RampGraphLegendComponent implements OnInit {
  forceDirectedGraphService = inject(ForceDirectedGraphService);
  // hoveredNode = computed(() => this.forceDirectedGraphService.reactionNode());
  hoveredNode = signal<GraphNode | null>(null);
  clickedNode = signal<GraphNode | null>(null);

  ngOnInit() {
    this.forceDirectedGraphService.nodeHovered.subscribe((res) => {
      this.hoveredNode.set(res);
    });
    this.forceDirectedGraphService.nodeClicked.subscribe((res) =>
      this.clickedNode.set(res)
    );
  }
}
