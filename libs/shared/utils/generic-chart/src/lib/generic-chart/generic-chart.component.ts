// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  Output,
  PLATFORM_ID,
  ViewChild
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Filter, FilterCategory } from "@ncats-frontend-library/models/utils";

@Component({
  selector: 'lib-generic-chart',
  standalone: true,
  imports: [CommonModule],
  template: ''
})
export class GenericChartComponent {
  @ViewChild('chartElement', { static: true }) chartElement!: ElementRef;
  @Input() data!: FilterCategory;
  svg!: any // Selection<BaseType, unknown, null, undefined>;
  svgExport: SVGElement;
  tooltip?: unknown;
  width!: number;
  height!: number;
  margins!: {top: number, bottom: number, left: number, right: number};
  keys!: string[];
  isBrowser = false;
  @Output() readonly clickElement: EventEmitter<Filter> = new EventEmitter<Filter>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: InjectionToken<NonNullable<unknown>>,
  ){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}
