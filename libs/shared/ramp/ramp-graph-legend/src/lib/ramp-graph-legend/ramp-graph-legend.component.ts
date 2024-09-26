import { Component, computed, inject, InjectionToken, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphNode } from '@ncats-frontend-library/models/utils';
import { NcatsDatatableComponent } from 'ncats-datatable';
import { ForceDirectedGraphService } from 'utils-force-directed-graph';

export const GRAPH_LEGEND = new InjectionToken<string>(
  'RampGraphLegendComponent',
);

@Component({
  selector: 'lib-ramp-graph-legend',
  standalone: true,
  imports: [CommonModule, NcatsDatatableComponent],
  templateUrl: './ramp-graph-legend.component.html',
  styleUrl: './ramp-graph-legend.component.scss',
})
export class RampGraphLegendComponent implements OnInit{
  forceDirectedGraphService = inject(ForceDirectedGraphService);
 // hoveredNode = computed(() => this.forceDirectedGraphService.reactionNode());
  hoveredNode = signal<GraphNode | null>(null);
  clickedNode = signal<GraphNode | null>(null);


  ngOnInit(){
    this.forceDirectedGraphService.nodeHovered.subscribe(res=> {
      this.hoveredNode.set(res)
    })
    this.forceDirectedGraphService.nodeClicked.subscribe(res=> this.clickedNode.set(res))
  }
}
