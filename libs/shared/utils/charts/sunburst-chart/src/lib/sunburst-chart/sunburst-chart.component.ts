// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  InjectionToken,
  Injector,
  input,
  OnInit,
  PLATFORM_ID,
  Signal,
  Type,
  viewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  interpolate,
  hierarchy,
  partition,
  quantize,
  interpolateRainbow,
} from 'd3';
import { scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';
import { arc } from 'd3-shape';
import { HierarchyNode } from 'utils-models';
import { ImageDownloadComponent } from 'image-download';
import { SunburstChartService } from './sunburst-chart.service';

@Component({
  selector: 'lib-sunburst-chart',
  imports: [CommonModule, ImageDownloadComponent, CdkPortalOutlet],
  templateUrl: './sunburst-chart.component.html',
  styleUrl: './sunburst-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SunburstChartComponent implements OnInit {
  platformId: InjectionToken<NonNullable<unknown>> = inject(
    PLATFORM_ID
  ) as InjectionToken<NonNullable<unknown>>;

  isBrowser = computed(() => isPlatformBrowser(this.platformId));

  chartElement: Signal<ElementRef> = viewChild.required('sunburstChartElement');
  _injector = inject(Injector);
  componentPortal?: ComponentPortal<unknown>;

  sunburstChartService = inject(SunburstChartService);

  context = computed(() => {
    if (this.isBrowser()) {
      const canvas = document.createElement('canvas');
      return canvas.getContext('2d');
    }
  });

  margins = { top: 20, bottom: 20, right: 30, left: 30 };

  width = computed(
    () =>
      this.chartElement().nativeElement.offsetWidth -
      this.margins.left -
      this.margins.right
  );

  height = computed(() => {
    if (this.chartElement().nativeElement.offsetHeight > 200) {
      return (
        this.chartElement().nativeElement.offsetHeight -
        this.margins.top -
        this.margins.bottom
      );
    } else return 500;
  });

  data = input<HierarchyNode[]>();

  radius = computed(() => Math.min(this.width(), this.height() * 2) / 6);
  color = computed(() =>
    scaleOrdinal(quantize(interpolateRainbow, this.data().length + 1))
  );

  hierarchy = computed(() => {
    return hierarchy({
      term: 'main',
      children: this.data(),
    } as HierarchyNode)
      .sum((d) => (d.children ? 0 : d.count))
      .sort((a, b) => b.count - a.count);
  });

  root = computed(() =>
    partition()
      .size([2 * Math.PI, this.hierarchy().height + 1])(this.hierarchy())
      .each((d) => (d['current'] = d))
  );

  arc = computed(() =>
    arc()
      .startAngle((d) => d['x0'])
      .endAngle((d) => d['x1'])
      .padAngle((d) => Math.min((d['x1'] - d['x0']) / 2, 0.005))
      .padRadius(this.radius() * 1.5)
      .innerRadius((d) => d['y0'] * this.radius())
      .outerRadius((d) =>
        Math.max(d['y0'] * this.radius(), d['y1'] * this.radius() - 1)
      )
  );

  svg = computed(() => {
    const element = this.chartElement()?.nativeElement;
    return (
      select(element)
        .append('svg:svg')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('class', 'chart-id')
        //.attr('viewBox', [-400, -400, 800, 800])
        .attr('viewBox', [
          -this.width() / 1.5,
          -this.height(),
          this.width() * 1.5,
          this.height() * 3,
        ])
        .attr('style', 'max-width: 100%; height: 100%;')
        .style('font', '16px sans-serif')
    );
  });

  chart = computed(() => {
    return this.svg()
      .append('circle')
      .datum(this.root())
      .attr('r', this.radius())
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('click', (event: Event, d: { [key: string]: unknown }) => {
        this._clicked(event, d);
      });
  });

  label = computed(() => {
    return this.svg()
      .append('g')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .style('user-select', 'none')
      .selectAll('text')
      .data(this.root().descendants().slice(1))
      .join('text')
      .attr('dy', '.35em')
      .classed('label-text', true)
      .attr('fill-opacity', (d) => +this._labelVisible(d['current']))
      .attr('transform', (d) => this._labelTransform(d['current']))
      .text((d) => {
        let label = d.data.term;
        const characterSize = this._getWidth(label) / label.length;
        if (this._getWidth(label) > this.radius()) {
          label = label.slice(0, this.radius() / characterSize - 3) + '...';
        }
        return label;
      });
  });

  path = computed(() =>
    this.svg()
      .append('g')
      .selectAll('path')
      .data(this.root().descendants().slice(1))
      .join('path')
      .attr('fill', (d) => {
        while (d.depth > 1) d = d.parent;
        return d.data.color ? d.data.color : this.color()(d.data.term);
      })
      .attr('fill-opacity', (d) =>
        this._arcVisible(d['current']) ? 1 / d.depth + 0.25 : 0
      )
      .attr('pointer-events', (d) =>
        this._arcVisible(d['current']) ? 'auto' : 'none'
      )
      .attr('d', (d) => this.arc()(d['current']))
      .on('mouseover', (event: Event, d) => {
        this.sunburstChartService.nodeHovered.emit({
          event: event,
          node: d.data as HierarchyNode,
        });
      })
  );
  svgExport = computed(
    () =>
      select(this.chartElement()?.nativeElement)
        .select('svg')
        .node() as SVGElement
  );

  ngOnInit() {
    if (this.chartElement() && this.isBrowser()) {
      if (this.context()) {
        this.context().font = '16px Roboto';
      }
      const element = this.chartElement()?.nativeElement;
      select(element).select('svg').remove();
      this.makeChart();
      this.label();
    }
    if (
      this.sunburstChartService &&
      this.sunburstChartService.customComponent
    ) {
      const comp = this._injector.get<Type<unknown>>(
        this.sunburstChartService.customComponent
      );
      this.componentPortal = new ComponentPortal(comp);
    }
  }

  makeChart() {
    this.path()
      .filter((d) => d.children)
      .style('cursor', 'pointer')
      .on('click', (event: Event, d) => {
        this._clicked(event, d);
        this.sunburstChartService.nodeClicked.emit({
          event: event,
          node: d.data as HierarchyNode,
        });
      });

    const t = this.path()
      .append('title')
      .html((d) => (d.data.label ? d.data.label : d.data.term));

    if (t !== null && t['classList']) {
      t.classed('.title-text');
    }
  }

  // Handle zoom on click.
  _clicked(event, p) {
    this.chart().datum(p.parent || this.root());

    this.root().each(
      (d) =>
        (d['target'] = {
          x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        })
    );

    const t = this.svg().transition().duration(750);
    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    this.path()
      .transition(t)
      .tween('data', (d: { [key: string]: unknown }) => {
        const i = interpolate(d['current'], d['target']);
        return (t) => (d['current'] = i(t));
      })
      .filter(function (d) {
        return (
          +this.getAttribute('fill-opacity') ||
          (d['target'].y1 <= 3 &&
            d['target'].y0 >= 1 &&
            d['target'].x1 > d['target'].x0)
        );
      })
      .attr('fill-opacity', (d) => {
        return this._arcVisible(d['target']) ? 1 / d['depth'] + 0.25 : 0;
      })
      .attr('pointer-events', (d) =>
        this._arcVisible(d['target']) ? 'auto' : 'none'
      )

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      .attrTween('d', (d) => () => this.arc()(d['current']));

    this.label()
      .filter(function (d) {
        return (
          +this?.getAttribute('fill-opacity') ||
          (d['target'].y1 <= 3 &&
            d['target'].y0 >= 1 &&
            d['target'].x1 > d['target'].x0)
        );
        //  this._arcVisible(d['target']);
      })
      .transition(t)
      .attr(
        'fill-opacity',
        (d) =>
          +this._labelVisible(
            d['target'] as { x0: number; y0: number; x1: number; y1: number }
          )
      )
      .attrTween(
        'transform',
        (d) => () =>
          this._labelTransform(
            d['current'] as { x0: number; y0: number; x1: number; y1: number }
          )
      );
  }

  _arcVisible(d: { x0: number; y0: number; x1: number; y1: number }) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  _labelVisible(d: { x0: number; y0: number; x1: number; y1: number }) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  _labelTransform(d: { x0: number; y0: number; x1: number; y1: number }) {
    const x = (((d['x0'] + d['x1']) / 2) * 180) / Math.PI;
    const y = ((d['y0'] + d['y1']) / 2) * this.radius();
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  /**
   * Measures the rendered width of arbitrary text given the font size and font face
   * @param {string} text The text to measure
   * @param {number} fontSize The font size in pixels
   * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
   * @returns {number} The width of the text
   **/
  _getWidth(text: string) {
    return this.context()?.measureText(text).width;
  }
}
