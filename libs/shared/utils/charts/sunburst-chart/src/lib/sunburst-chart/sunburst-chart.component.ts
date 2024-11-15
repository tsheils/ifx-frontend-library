// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { CdkScrollable } from '@angular/cdk/overlay';
import {
  CdkPortal,
  CdkPortalOutlet,
  ComponentPortal,
} from '@angular/cdk/portal';
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
import { HierarchyNode } from '@ncats-frontend-library/models/utils';
import { ImageDownloadComponent } from 'image-download';
import { SunburstChartService } from './sunburst-chart.service';

@Component({
  selector: 'lib-sunburst-chart',
  standalone: true,
  imports: [
    CommonModule,
    ImageDownloadComponent,
    CdkScrollable,
    CdkPortal,
    CdkPortalOutlet,
  ],
  templateUrl: './sunburst-chart.component.html',
  styleUrl: './sunburst-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SunburstChartComponent implements OnInit {
  platformId: InjectionToken<NonNullable<unknown>> = inject(
    PLATFORM_ID,
  ) as InjectionToken<NonNullable<unknown>>;

  isBrowser = computed(() => isPlatformBrowser(this.platformId));

  sunburstChartService = inject(SunburstChartService);
  chartElement: Signal<ElementRef | undefined> = viewChild(
    'sunburstChartElement',
  );
  _injector = inject(Injector);
  componentPortal?: ComponentPortal<unknown>;

  context = computed(() => {
    if (this.isBrowser()) {
      const canvas = document.createElement('canvas');
      return canvas.getContext('2d');
    }
  });

  margins = { top: 20, bottom: 20, right: 30, left: 30 };

  width = computed(
    () =>
      this.chartElement()?.nativeElement.offsetWidth -
      this.margins.left -
      this.margins.right,
  );

  height = computed(
    () =>
      this.chartElement()?.nativeElement.offsetHeight -
      this.margins.top -
      this.margins.bottom,
  );

  data = input<HierarchyNode[]>();

  // data = signal({"term":"flare","children":[{"term":"analytics","children":[{"term":"cluster","children":[{"term":"AgglomerativeCluster","count":3938},{"term":"CommunityStructure","count":3812},{"term":"HierarchicalCluster","count":6714},{"term":"MergeEdge","count":743}]},{"term":"graph","children":[{"term":"BetweennessCentrality","count":3534},{"term":"LinkDistance","count":5731},{"term":"MaxFlowMinCut","count":7840},{"term":"ShortestPaths","count":5914},{"term":"SpanningTree","count":3416}]},{"term":"optimization","children":[{"term":"AspectRatioBanker","count":7074}]}]},{"term":"animate","children":[{"term":"Easing","count":17010},{"term":"FunctionSequence","count":5842},{"term":"interpolate","children":[{"term":"ArrayInterpolator","count":1983},{"term":"ColorInterpolator","count":2047},{"term":"DateInterpolator","count":1375},{"term":"Interpolator","count":8746},{"term":"MatrixInterpolator","count":2202},{"term":"NumberInterpolator","count":1382},{"term":"ObjectInterpolator","count":1629},{"term":"PointInterpolator","count":1675},{"term":"RectangleInterpolator","count":2042}]},{"term":"ISchedulable","count":1041},{"term":"Parallel","count":5176},{"term":"Pause","count":449},{"term":"Scheduler","count":5593},{"term":"Sequence","count":5534},{"term":"Transition","count":9201},{"term":"Transitioner","count":19975},{"term":"TransitionEvent","count":1116},{"term":"Tween","count":6006}]},{"term":"data","children":[{"term":"converters","children":[{"term":"Converters","count":721},{"term":"DelimitedTextConverter","count":4294},{"term":"GraphMLConverter","count":9800},{"term":"IDataConverter","count":1314},{"term":"JSONConverter","count":2220}]},{"term":"DataField","count":1759},{"term":"DataSchema","count":2165},{"term":"DataSet","count":586},{"term":"DataSource","count":3331},{"term":"DataTable","count":772},{"term":"DataUtil","count":3322}]},{"term":"display","children":[{"term":"DirtySprite","count":8833},{"term":"LineSprite","count":1732},{"term":"RectSprite","count":3623},{"term":"TextSprite","count":10066}]},{"term":"flex","children":[{"term":"FlareVis","count":4116}]},{"term":"physics","children":[{"term":"DragForce","count":1082},{"term":"GravityForce","count":1336},{"term":"IForce","count":319},{"term":"NBodyForce","count":10498},{"term":"Particle","count":2822},{"term":"Simulation","count":9983},{"term":"Spring","count":2213},{"term":"SpringForce","count":1681}]},{"term":"query","children":[{"term":"AggregateExpression","count":1616},{"term":"And","count":1027},{"term":"Arithmetic","count":3891},{"term":"Average","count":891},{"term":"BinaryExpression","count":2893},{"term":"Comparison","count":5103},{"term":"CompositeExpression","count":3677},{"term":"Count","count":781},{"term":"DateUtil","count":4141},{"term":"Distinct","count":933},{"term":"Expression","count":5130},{"term":"ExpressionIterator","count":3617},{"term":"Fn","count":3240},{"term":"If","count":2732},{"term":"IsA","count":2039},{"term":"Literal","count":1214},{"term":"Match","count":3748},{"term":"Maximum","count":843},{"term":"methods","children":[{"term":"add","count":593},{"term":"and","count":330},{"term":"average","count":287},{"term":"count","count":277},{"term":"distinct","count":292},{"term":"div","count":595},{"term":"eq","count":594},{"term":"fn","count":460},{"term":"gt","count":603},{"term":"gte","count":625},{"term":"iff","count":748},{"term":"isa","count":461},{"term":"lt","count":597},{"term":"lte","count":619},{"term":"max","count":283},{"term":"min","count":283},{"term":"mod","count":591},{"term":"mul","count":603},{"term":"neq","count":599},{"term":"not","count":386},{"term":"or","count":323},{"term":"orderby","count":307},{"term":"range","count":772},{"term":"select","count":296},{"term":"stddev","count":363},{"term":"sub","count":600},{"term":"sum","count":280},{"term":"update","count":307},{"term":"variance","count":335},{"term":"where","count":299},{"term":"xor","count":354},{"term":"_","count":264}]},{"term":"Minimum","count":843},{"term":"Not","count":1554},{"term":"Or","count":970},{"term":"Query","count":13896},{"term":"Range","count":1594},{"term":"StringUtil","count":4130},{"term":"Sum","count":791},{"term":"Variable","count":1124},{"term":"Variance","count":1876},{"term":"Xor","count":1101}]},{"term":"scale","children":[{"term":"IScaleMap","count":2105},{"term":"LinearScale","count":1316},{"term":"LogScale","count":3151},{"term":"OrdinalScale","count":3770},{"term":"QuantileScale","count":2435},{"term":"QuantitativeScale","count":4839},{"term":"RootScale","count":1756},{"term":"Scale","count":4268},{"term":"ScaleType","count":1821},{"term":"TimeScale","count":5833}]},{"term":"util","children":[{"term":"Arrays","count":8258},{"term":"Colors","count":10001},{"term":"Dates","count":8217},{"term":"Displays","count":12555},{"term":"Filter","count":2324},{"term":"Geometry","count":10993},{"term":"heap","children":[{"term":"FibonacciHeap","count":9354},{"term":"HeapNode","count":1233}]},{"term":"IEvaluable","count":335},{"term":"IPredicate","count":383},{"term":"IcountProxy","count":874},{"term":"math","children":[{"term":"DenseMatrix","count":3165},{"term":"IMatrix","count":2815},{"term":"SparseMatrix","count":3366}]},{"term":"Maths","count":17705},{"term":"Orientation","count":1486},{"term":"palette","children":[{"term":"ColorPalette","count":6367},{"term":"Palette","count":1229},{"term":"ShapePalette","count":2059},{"term":"SizePalette","count":2291}]},{"term":"Property","count":5559},{"term":"Shapes","count":19118},{"term":"Sort","count":6887},{"term":"Stats","count":6557},{"term":"Strings","count":22026}]},{"term":"vis","children":[{"term":"axis","children":[{"term":"Axes","count":1302},{"term":"Axis","count":24593},{"term":"AxisGridLine","count":652},{"term":"AxisLabel","count":636},{"term":"CartesianAxes","count":6703}]},{"term":"controls","children":[{"term":"AnchorControl","count":2138},{"term":"ClickControl","count":3824},{"term":"Control","count":1353},{"term":"ControlList","count":4665},{"term":"DragControl","count":2649},{"term":"ExpandControl","count":2832},{"term":"HoverControl","count":4896},{"term":"IControl","count":763},{"term":"PanZoomControl","count":5222},{"term":"SelectionControl","count":7862},{"term":"TooltipControl","count":8435}]},{"term":"data","children":[{"term":"Data","count":20544},{"term":"DataList","count":19788},{"term":"DataSprite","count":10349},{"term":"EdgeSprite","count":3301},{"term":"NodeSprite","count":19382},{"term":"render","children":[{"term":"ArrowType","count":698},{"term":"EdgeRenderer","count":5569},{"term":"IRenderer","count":353},{"term":"ShapeRenderer","count":2247}]},{"term":"ScaleBinding","count":11275},{"term":"Tree","count":7147},{"term":"TreeBuilder","count":9930}]},{"term":"events","children":[{"term":"DataEvent","count":2313},{"term":"SelectionEvent","count":1880},{"term":"TooltipEvent","count":1701},{"term":"VisualizationEvent","count":1117}]},{"term":"legend","children":[{"term":"Legend","count":20859},{"term":"LegendItem","count":4614},{"term":"LegendRange","count":10530}]},{"term":"operator","children":[{"term":"distortion","children":[{"term":"BifocalDistortion","count":4461},{"term":"Distortion","count":6314},{"term":"FisheyeDistortion","count":3444}]},{"term":"encoder","children":[{"term":"ColorEncoder","count":3179},{"term":"Encoder","count":4060},{"term":"PropertyEncoder","count":4138},{"term":"ShapeEncoder","count":1690},{"term":"SizeEncoder","count":1830}]},{"term":"filter","children":[{"term":"FisheyeTreeFilter","count":5219},{"term":"GraphDistanceFilter","count":3165},{"term":"VisibilityFilter","count":3509}]},{"term":"IOperator","count":1286},{"term":"label","children":[{"term":"Labeler","count":9956},{"term":"RadialLabeler","count":3899},{"term":"StackedAreaLabeler","count":3202}]},{"term":"layout","children":[{"term":"AxisLayout","count":6725},{"term":"BundledEdgeRouter","count":3727},{"term":"CircleLayout","count":9317},{"term":"CirclePackingLayout","count":12003},{"term":"DendrogramLayout","count":4853},{"term":"ForceDirectedLayout","count":8411},{"term":"IcicleTreeLayout","count":4864},{"term":"IndentedTreeLayout","count":3174},{"term":"Layout","count":7881},{"term":"NodeLinkTreeLayout","count":12870},{"term":"PieLayout","count":2728},{"term":"RadialTreeLayout","count":12348},{"term":"RandomLayout","count":870},{"term":"StackedAreaLayout","count":9121},{"term":"TreeMapLayout","count":9191}]},{"term":"Operator","count":2490},{"term":"OperatorList","count":5248},{"term":"OperatorSequence","count":4190},{"term":"OperatorSwitch","count":2581},{"term":"SortOperator","count":2023}]},{"term":"Visualization","count":16540}]}]})

  radius = computed(() => Math.min(this.width(), this.height() * 2) / 6);
  color = computed(() =>
    scaleOrdinal(quantize(interpolateRainbow, this.data().length + 1)),
  );

  hierarchy = computed(() => {
    return hierarchy({
      term: 'main',
      children: this.data(),
    } as HierarchyNode)
      .sum((d) => d.count || 0)
      .sort((a, b) => b.count - a.count);
  });

  root = computed(() =>
    partition()
      .size([2 * Math.PI, this.hierarchy().height + 1])(this.hierarchy())
      .each((d) => (d['current'] = d)),
  );

  arc = computed(() =>
    arc()
      .startAngle((d) => d['x0'])
      .endAngle((d) => d['x1'])
      .padAngle((d) => Math.min((d['x1'] - d['x0']) / 2, 0.005))
      .padRadius(this.radius() * 1.5)
      .innerRadius((d) => d['y0'] * this.radius())
      .outerRadius((d) =>
        Math.max(d['y0'] * this.radius(), d['y1'] * this.radius() - 1),
      ),
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
        .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
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
        this._arcVisible(d['current']) ? 1 / d.depth + 0.25 : 0,
      )
      .attr('pointer-events', (d) =>
        this._arcVisible(d['current']) ? 'auto' : 'none',
      )
      .attr('d', (d) => this.arc()(d['current']))
      .on('mouseover', (event: Event, d) => {
        this.sunburstChartService.nodeHovered.emit({
          event: event,
          node: d.data as HierarchyNode,
        });
      }),
  );
  svgExport = computed(
    () =>
      select(this.chartElement()?.nativeElement)
        .select('svg')
        .node() as SVGElement,
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
        this.sunburstChartService.customComponent,
      );
      this.componentPortal = new ComponentPortal(comp);
    }
  }

  makeChart() {
    // Make them clickable if they have children.
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
        }),
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
        this._arcVisible(d['target']) ? 'auto' : 'none',
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
            d['target'] as { x0: number; y0: number; x1: number; y1: number },
          ),
      )
      .attrTween(
        'transform',
        (d) => () =>
          this._labelTransform(
            d['current'] as { x0: number; y0: number; x1: number; y1: number },
          ),
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
