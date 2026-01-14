import {
  EventEmitter,
  Injectable,
  InjectionToken,
  Output,
  output,
  signal,
} from '@angular/core';
import { HierarchyNode } from 'utils-models';
import { ReactionClass } from 'ramp';

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

  customComponent?: InjectionToken<string>;
  reactionNode = signal<ReactionClass | undefined>(undefined);

  hoverNode(data: { event: Event; node: HierarchyNode }) {
    this.nodeHovered.emit(data);
  }

  clickNode(data: { event: Event; node: HierarchyNode }) {
    this.nodeClicked.emit(data);
  }
}
