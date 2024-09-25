// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { CdkPortal, CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  InjectionToken,
  Injector,
  input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  Signal,
  signal,
  Type,
  viewChild,
  ViewEncapsulation
} from '@angular/core';
import { GraphData, GraphNode } from '@ncats-frontend-library/models/utils';
import {
  drag,
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  schemeCategory10,
  selectAll,
  zoom
} from 'd3';
import { scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';
import { ForceDirectedGraphService } from './force-directed-graph.service';

@Component({
  selector: 'lib-utils-force-directed-graph',
  standalone: true,
  imports: [
    CommonModule,
    CdkPortal,
    CdkPortalOutlet,
  ],
  templateUrl: './utils-force-directed-graph.component.html',
  styleUrl: './utils-force-directed-graph.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UtilsForceDirectedGraphComponent
  implements OnInit, OnChanges {
  platformId: InjectionToken<NonNullable<unknown>> = inject(
    PLATFORM_ID
  ) as InjectionToken<NonNullable<unknown>>;
  isBrowser = computed(() => isPlatformBrowser(this.platformId));
  chartElement = viewChild<ElementRef>('graphElement');
  width = computed(() => this.chartElement()?.nativeElement.offsetWidth - this.margins().left - this.margins().right);
  height = computed(() => this.chartElement()?.nativeElement.offsetHeight + this.margins().top + this.margins().bottom);
  margins = signal({ top: 10, bottom: 10, left: 10, right: 10 });
  svgExport = computed(() => <SVGElement>(
      select(this.chartElement()?.nativeElement).select('svg').node()
    )
  );
  data = input<GraphData>();

  graphChartService = inject(ForceDirectedGraphService);
  graphLegendElement: Signal<ElementRef | undefined> = viewChild(
    'forceDirectedGraphElement',
  );
  _injector = inject(Injector);
  componentPortal?: ComponentPortal<unknown>;

  color = scaleOrdinal(schemeCategory10);

gZoom = computed(() => this.svg().append('g'))

   svg = computed(() =>
    select(this.chartElement()?.nativeElement)
      .append('svg:svg')
      .attr('width', this.width())
      .attr('height', this.height())
      .attr('viewBox', [0, 0, this.width(), this.height()])
      .attr('style', 'max-width: 100%; height: auto;')
      .call(
        zoom()
          .extent([[0, 0], [this.width(), this.height()]])
          .scaleExtent([-1, 8])
          .on("zoom", (event) => this.zoomed(event)))
)

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
   links =  computed(() => this.data()!.graph!.links.map(d => ({ ...d })));
   nodes =  computed(() => this.data()!.graph!.nodes.map(d => ({ ...d })));

   simulation =
    computed(() =>
      forceSimulation(this.nodes())
        .force('link', forceLink(this.links()).id(d => d.id))
        .force('charge', forceManyBody())
        .force('center', forceCenter(this.width() / 2, this.height() / 2))
        .force("x", forceX())
        .force("y", forceY())
        .on('tick',() => this.ticked())
    )

  link = computed(() =>
    this.gZoom().append('g')
      .selectAll()
      .data(this.links())
      .join('line')
      .classed('edgeLinks', true)
      .attr('stroke-width', 1)
      .attr('stroke', (d) => d.color || '#ffffff')
      .attr('opacity', .2)

  )
  // Add a drag behavior.;
  // Add a line for each link, and a circle for each node.
  squareNode = computed(() =>
      this.gZoom()
        .append('g')
        .selectAll()
        .data(this.nodes().filter(n => n.shape ==='rect'))
        .join('rect')
        .classed('dataNode', true)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', d => d.color ? d.color: 'black')
        .attr('opacity', .5)
        .attr('stroke-width', .5)
        .attr('stroke', '#000000')
        .join("text")
        .text(d => d.id)
        .on("click", (event, d) => this.clicked(event, d))
        .on("mouseover", (event, d) => this.hovered(event, d))
        .on("mouseout", (event, d) => this.hoveredOff(event, d))

        .call(
          drag()
            .on("start", (event) => this.dragStarted(event))
            .on("drag", (event) => this.dragged(event))
            .on("end", (event) => this.dragEnded(event)))
  )

circleNode = computed(() =>
      this.gZoom()
        .append('g')
        .selectAll()
        .data(this.nodes().filter(n => n.shape ==='circle'))
        .join('circle')
        .classed('dataNode', true)
        .attr('r', 5)
        .attr('fill', d => d.color ? d.color: 'black')
        .attr('opacity', .5)
        .attr('stroke-width', .5)
        .attr('stroke', '#000000')
        .join("text")
        .text(d => d.id)
        .on("click", (event, d) => this.clicked(event, d))
        .on("mouseover", (event, d) => this.hovered(event, d))
        .on("mouseout", (event, d) => this.hoveredOff(event, d))
        .call(
          drag()
            .on("start", (event) => this.dragStarted(event))
            .on("drag", (event) => this.dragged(event))
            .on("end", (event) => this.dragEnded(event)))
  )

  allNodes = computed(() => selectAll('.dataNode'))


  labels = computed(() =>
      this.gZoom()
        .append('g')
        .attr('pointer-events', 'none')
        .attr('text-anchor', 'middle')
        .style('user-select', 'none')
        .selectAll('text')
        .data(this.nodes())
        .join('text')
        .attr('dy', '.35em')
        .text((d) => d.id)
        )


ngOnInit(): void {
    this.simulation().restart();

  if (
    this.graphChartService &&
    this.graphChartService.customComponent
  ) {
    const comp = this._injector.get<Type<unknown>>(
      this.graphChartService.customComponent,
    );
    this.componentPortal = new ComponentPortal(comp);
  }
  }

  clicked(event, d) {
     selectAll(this.link())
      .classed('hoveredEdge', (l) => l.target['id'] === d.id || l.source['id'] === d.id )
      .transition()
      .duration(100)

    d.color= 'purple';
    select(event.target).attr('fill', 'purple')
      .attr('opacity', 1)
    this.graphChartService.nodeClicked.emit(d as GraphNode);
  }

hovered(event, d) {
    const filterList =  this.links().filter((l) => l.target['id'] === d.id || l.source['id'] === d.id )
  const nodes = Array.from(new Set([...filterList.map(l => l.target['id']), ...filterList.map(l => l.source['id'])]));

    selectAll(this.link())
    .classed('hoveredEdge', (l) => l.target['id'] === d.id || l.source['id'] === d.id )
    .transition()
    .duration(100)

  selectAll(this.allNodes())
    .classed('hoveredNode', (n) => nodes.includes(n.id))
    .transition()
    .duration(100)

     select(event.target).attr('fill', 'green')
     .attr('opacity', 1)
  this.graphChartService.nodeHovered.emit(d as GraphNode);
  }

  hoveredOff(event, d) {
     select(event.target)
       .attr('fill', d.color)
     .attr('opacity', .7)
    this.graphChartService.nodeHovered.emit(null);
  }

  zoomed({transform}) {
    this.gZoom().attr("transform", transform);
  }




  // Set the position attributes of links and nodes each time the simulation ticks.
  ticked() {
    this.link()
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    this.squareNode()
      .attr('x', d => d.x)
      .attr('y', d => d.y);
    this.circleNode()
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  /*  this.labels()
      .attr('x', d => d.x)
      .attr('y', d => d.y);*/
  }

  // Reheat the simulation when drag starts, and fix the subject position.
  dragStarted(event) {
    if (!event.active) this.simulation().alphaTarget(0.3).restart();
    event.subject.fx = event['subject'].x;
    event.subject.fy = event['subject'].y;
  }

  // Update the subject (dragged node) position during drag.
  dragged(event) {
    event.subject.fx = event['x'];
    event.subject.fy = event['y'];
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  dragEnded(event) {
    if (!event.active) this.simulation().alphaTarget(0);
    event['subject'].fx = event['x'];
    event['subject'].fy = event['y'];
  }

}
