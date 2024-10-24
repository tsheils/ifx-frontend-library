import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  InjectionToken,
  input,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Filter } from '@ncats-frontend-library/models/utils';
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

  readonly clickElement = output<Filter>();
  destroyRef = inject(DestroyRef);

  chartElement = viewChild<ElementRef>('chartElement');
  width = computed(
    () =>
      this.chartElement()?.nativeElement.offsetWidth -
      this.margins().left -
      this.margins().right,
  );
  height = computed(
    () =>
      this.chartElement()?.nativeElement.offsetHeight +
      this.margins().top +
      this.margins().bottom,
  );
  isBrowser = computed(() => isPlatformBrowser(this.platformId));
  margins = signal({ top: 10, bottom: 10, left: 10, right: 10 });
  svgExport = computed(
    () =>
      <SVGElement>(
        select(this.chartElement()?.nativeElement).select('svg').node()
      ),
  );

  dataSignal = input();
  svg!: any; // Selection<BaseType, unknown, null, undefined>;
  tooltip!: Selection<null, undefined, null, undefined>;
  keys!: string[];
}
