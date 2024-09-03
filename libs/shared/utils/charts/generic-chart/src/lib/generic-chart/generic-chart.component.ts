import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  input,
  Input,
  output,
  Output,
  PLATFORM_ID,
  signal,
  Signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Filter, FilterCategory } from '@ncats-frontend-library/models/utils';
import { select, Selection } from 'd3-selection';

@Component({
  selector: 'lib-generic-chart',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class GenericChartComponent {
  platformId: InjectionToken<NonNullable<unknown>> = inject(
    PLATFORM_ID,
  ) as InjectionToken<NonNullable<unknown>>;

  @ViewChild('chartElement', { static: true }) chartElement!: ElementRef;
  @Input() data!: FilterCategory;
  svg!: any; // Selection<BaseType, unknown, null, undefined>;
  svgExport!: SVGElement;
  tooltip!: Selection<null, undefined, null, undefined>;
  width!: number;
  height!: number;
  margins!: { top: number; bottom: number; left: number; right: number };
  keys!: string[];
  isBrowser = computed(() => isPlatformBrowser(this.platformId));
  @Output() readonly clickElement: EventEmitter<Filter> =
    new EventEmitter<Filter>();

  /*platformId: InjectionToken<NonNullable<unknown>> = inject(
    PLATFORM_ID,
  ) as InjectionToken<NonNullable<unknown>>;

  chartElement = viewChild<ElementRef>('chartElement');

  data = input<FilterCategory>();
  isBrowser = computed(() => isPlatformBrowser(this.platformId));
  readonly clickElement = output<Filter>();
  margins = {top: 10, bottom: 10, left: 10, right: 10};
  width = computed(
    () =>
      this.chartElement()?.nativeElement.offsetWidth - this.margins.left - this.margins.right,
  );
  height = computed(
    () =>
      this.chartElement()?.nativeElement.offsetHeight -
      this.margins.top -
      this.margins.bottom,
  );

  svgExport = computed(() => {
    <SVGElement>(
      select(this.chartElement()?.nativeElement).select('svg').node()
    )
  })*/
}
