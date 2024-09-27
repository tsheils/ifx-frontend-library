import {
  EventEmitter,
  Injectable,
  InjectionToken,
  Output,
  output,
  signal,
} from '@angular/core';
import { GraphNode } from '@ncats-frontend-library/models/utils';
import { DataProperty } from 'ncats-datatable';
import { CommonAnalyte } from 'ramp';

@Injectable({
  providedIn: 'root',
})
export class ForceDirectedGraphService {

  // note - angular 18 doesn't support output<>() in services, you need an event emitter
  @Output() nodeHovered = new EventEmitter<GraphNode| null>();
  @Output() nodeClicked = new EventEmitter<GraphNode| null>();


  customComponent?: InjectionToken<string>;
  analyteData = signal<  {data: { [key: string]: DataProperty }[], fields: DataProperty[]} | undefined>(undefined);

  hoverNode(data: { event: Event; node: GraphNode }) {
    this.nodeHovered.emit(data.node);
  }

  clickNode(data: { event: Event; node: GraphNode }) {
    this.nodeClicked.emit(data.node);
  }
}
