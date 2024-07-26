import { EventEmitter, Injectable, Output, output } from '@angular/core';
import { HierarchyNode } from '@ncats-frontend-library/models/utils';

@Injectable({
  providedIn: 'root',
})
export class SunburstChartService {
  @Output() nodeHovered = new EventEmitter<{
    event: Event;
    node: HierarchyNode;
  }>();
  @Output() nodeClicked = new EventEmitter<{
    event: Event;
    node: HierarchyNode;
  }>();

  hoverNode(data: { event: Event; node: HierarchyNode }) {
    this.nodeHovered.emit(data);
  }

  clickNode(data: { event: Event; node: HierarchyNode }) {
    this.nodeClicked.emit(data);
  }
}
