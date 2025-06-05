import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  input,
  OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { UpsetData, UpsetPlot } from '@ncats-frontend-library/models/utils';
import { axisBottom, BaseType, min, pointer } from 'd3';
import { GenericChartComponent } from 'generic-chart';
import { select, Selection } from 'd3-selection';
import { axisLeft } from 'd3-axis';
import { scaleBand, scaleLinear, scaleLog } from 'd3-scale';
import { format } from 'd3-format';
import { max } from 'd3-array';

@Component({
  selector: 'lib-shared-utils-upset-chart',
  templateUrl: './upset-chart.component.html',
  styleUrls: ['./upset-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UpsetComponent extends GenericChartComponent implements OnInit {
  upSetBarClicked = output();
  scale = input<'linear' | 'log'>('linear');
  title = input<string>();
  chartData = input<UpsetPlot>();

  innerMargin = 10;

  leftColWidth = computed(() => this.width() * 0.4);

  topRowHeight = computed(() => this.height() * 0.6);
  bottomRowHeight = computed(
    () =>
      this.height() -
      this.topRowHeight()
  );

  minimumWidth = computed(()=> <number>this.chartData()?.data.length * 50)

  // scale for intersection bar height
  intersectionSizeScale = computed(() => {
    let intersectionScale;
    if (this.scale() === 'log') {
      intersectionScale = scaleLog()
        .domain([1, this._getMax()])
        .range([this.topRowHeight(), 0]);
    } else {
      intersectionScale = scaleLinear()
        .domain([0, this._getMax()]).nice()
        .range([this.topRowHeight(), 0]);
    }
    return intersectionScale;
  });

  //scale for set size bar chart
  setSizeScale = computed(() => {
    let setScale;
    if (this.scale() === 'log') {
      setScale = scaleLog()
        .domain([
          1,
          <number>(
            max(
              this.chartData()!.allSetIds,
              (d: { id: string; count: number }) => {
                return d.count;
              }
            )
          ),

        ]).nice()
        .range([0, this.leftColWidth()*.60])
    } else {
      setScale = scaleLinear()
        .domain([
          0,
          <number>(
            max(
              this.chartData()!.allSetIds,
              (d: { id: string; count: number }) => {
                return d.count;
              }
            )
          ),
        ])
        .range([0, this.leftColWidth()*.60]);
    }
    return setScale;
  });

  // scale for intersection bar width
  xScale = computed(() =>
    scaleBand()
      .domain(this.chartData()!.data.map((d) => d.id))
      .range([0, <number>this.minimumWidth()])
      .paddingInner(0.2)
  );

  // scale for set row height
  yCombinationScale = computed(() =>
    scaleBand()
      .domain(this.chartData()!.allSetIds.map((set) => set.id))
      .range([0, this.bottomRowHeight()])
      .paddingInner(-1.5)
  );

  // Prepare the overall layout
  override svg = computed(() => {
    const svg = select(this.chartElement()!.nativeElement)
    if (svg) {
     const svg2 = svg
        .append('svg:svg')
        .attr('width', this.width())
        .attr('height', this.height())
        .attr('viewBox', [0, 0, this.width(), this.height()])
        .style("position", "absolute")
       .style("pointer-events", "none")
       .style("z-index", 1)

        svg2.append('svg:rect')
        .attr('width', this.leftColWidth())
        .attr('height', this.height())
        .classed("svg-rectangle-fill", true)

        svg2.append("svg:g")
          .classed('left-column', true)

      const rightColumnHolder = svg
        .append("div")
        .style("overflow-x", "scroll")
        .style("-webkit-overflow-scrolling", "touch")
        .attr(
          'transform',
          `translate(${this.leftColWidth() - this.margins().left}, 0)`
        );

      const rc = rightColumnHolder
        .append("svg:svg")
        .attr("width", this.minimumWidth() + this.leftColWidth() + this.margins().left + this.margins().right)
        .attr("height", this.height())
        .style("display", "block")
        .attr('viewBox', [0, 0, this.minimumWidth() + this.leftColWidth() + this.margins().left + this.margins().right, this.height()])
        .append('svg:g')
        .classed('right-column', true)
        .attr(
          'transform',
          `translate(${this.leftColWidth() + this.margins().left}, ${this.margins().top})`
        );

      // add tooltip last
      this.tooltip = svg2
        .append('svg:g')
        .attr('class', 'tooltip')
        .style('pointer-events', 'none') as Selection<null, undefined, null, undefined>

      return svg
    } else return undefined
    })


  staticSvg = computed(() => {
      const leftColumn = this.svg()!.select('.left-column')
      if (leftColumn) {
      const tlc =  leftColumn
        .append('svg:g')
        .classed('top-row-left-column', true)


      tlc.append('svg:g')
        .classed('set-size', true)
        .attr(
          'transform',
          `translate(0, ${this.topRowHeight()})`
        );

      const lc =  leftColumn.append('svg:g')
        .classed('bottom-row-left-column', true)
        .attr(
          'transform',
          `translate(0, ${this.topRowHeight() + this.margins().top})`
        );

      lc.append('svg:g')
        .classed('set-size-chart', true)
        .attr(
          'transform',
          `translate(${this.margins().left}, ${this.margins().top/2})`
        );
      lc.append('svg:g')
        .classed('set-names', true)
        .attr(
          'transform',
          `translate(0, ${this.margins().top /2})`
        );
      return leftColumn
    } else return undefined;
  });

  scrollSvg = computed(() => {
    const rightColumn = this.svg()!.select('.right-column')
    if(rightColumn) {
      rightColumn.append('svg:g')
        .attr('id', 'top-row-right-column')
        .classed('top-row-right-column', true)
              .style("display", "block")
        .attr(
          'transform',
          `translate(0, 0)`
        );

      rightColumn
        .append('svg:g')
        .classed('bottom-row-right-column', true)
        .attr(
          'transform',
          `translate(0, ${this.topRowHeight() + this.margins().top + this.margins().bottom})`
        )

      return rightColumn
    } else return undefined;
  });

  setCountBarChart = computed(() => {
    if (this.staticSvg()) {
      const setSizeChart = this.staticSvg()!.select('.set-size-chart')
      const barChart = setSizeChart
        .append('svg:g')
        .classed('set-name-bar-chart', true)
        .selectAll('.set-bar')
        .data(() => {
          const chartData = this.chartData() as UpsetPlot;
          return chartData.allSetIds;
        })
        .join((enter) => {
          const group = enter.append('g').classed('set-bar-group', true);
          group
            .append('rect')
            .attr('class', 'bar')
            .attr('width', (d) => {
              let ret = this.setSizeScale()(<number>d.count);
              if (!ret) {
                ret = 0
              }
              return ret;
            })
            .attr(
              'height',
              <number>min([20, <number>(this.bottomRowHeight() / this.chartData()!.allSetIds.length)])
            )
            .attr('x', (d) => {
              let ret = this.setSizeScale()(<number>d.count);
              if (!ret) {
                ret = this.leftColWidth() * 0.6;
              }

              return this.leftColWidth() * 0.6 - ret + this.innerMargin + 2;
            })
            .attr('y', (d) => {
              let ret = this.yCombinationScale()(d.id);
              if (!ret) {
                ret = 0;
              }
              return ret;
            });
          group
            .append('text')
            .classed('set-bar-labels', true)
            .attr('text-anchor', 'end')
            .attr('font-size', '.8em')
        .attr(
              'x',
              (d: { count: number; id: string }) => {
                let ret = this.setSizeScale()(<number>d.count);
                if (!ret) {
                  ret = this.leftColWidth() * 0.6
                }

                return this.leftColWidth() * 0.6 - ret
              }
            )
            .attr('y', (d) => {
              let ret = this.yCombinationScale()(d.id);
              if (!ret) {
                ret = 0;
              }
              return ret + (<number>min([20, <number>(this.bottomRowHeight() / this.chartData()!.allSetIds.length)])/2);
            })
            .text((d) => format(',d')(Number(d.count)));

           group
             .append('rect')
             .attr('class', 'hover-row')
             .attr(
               'width', ((d) => {
                 let ret = this.setSizeScale()(<number>d.count);
                 if (!ret) {
                   ret = this.leftColWidth() * 0.6;
                 }
                 const barWidth = this.leftColWidth() * 0.6 - ret + this.innerMargin + 2;
                 return this.width() - barWidth
               })
             )
             .attr(
               'height',
               <number>min([20, <number>(this.bottomRowHeight() / this.chartData()!.allSetIds.length)])
             )
             .attr('x', (d) => {
               let ret = this.setSizeScale()(<number>d.count);
               if (!ret) {
                 ret = this.leftColWidth() * 0.6;
               }

               return this.leftColWidth() * 0.6 - ret + this.innerMargin + 2;
             })
             .attr('y', (d) => {
               let ret = this.yCombinationScale()(d.id);
               if (!ret) {
                 ret = 0;
               }
               return ret;
             });

          group.on('mouseover', (event: Event, d) => {
            select((<unknown>event.currentTarget) as string)
              .classed('hovered', true)
              .transition()
              .duration(300);
            this.rowHovered(d.id);
          });

          group.on('mouseout', (event: Event) => {
            select((<unknown>event.currentTarget) as string)
              .classed('hovered', false)
              .transition()
              .duration(300);
            this.rowHoveredOff();
          });
          return group;
        });


      const setNames = this.staticSvg()!.select('.set-names')
      setNames
        .append('svg:g')
        .classed('set-name-list', true)
        .selectAll('.set-name')
        .data(() => {
          const chartData = this.chartData() as UpsetPlot;
          return chartData.allSetIds;
        })
        .join((enter) => {
          const group = enter.append('g').classed('set-name-group', true);
          group
            .append('text')
            .classed('set-name', true)
            .attr('text-anchor', 'end')
            .attr('font-size', '1em')
            .attr('x', this.leftColWidth())
            .attr('y', (d) => {
              let ret = this.yCombinationScale()(d.id);
              if (!ret) {
                ret = 0;
              }
              return ret + ((this.bottomRowHeight() / (this.chartData()!.allSetIds.length + 1)) / 2)
            })
            .text((d) => d.id);
          return group
        });

      const scaleCopy = this.setSizeScale().copy()
      scaleCopy.domain(scaleCopy.domain().reverse())

      const setSizeScale =
       setSizeChart
        .append('g')
        .classed('set-size-scale', true)
          .attr(
            'transform',
            `translate(${this.innerMargin}, -${this.margins().top})`
          )
        .call(
          axisBottom(scaleCopy)
            .tickFormat((d, i) => {
              const divisor = this.scale() === 'log' ? 10 : 2
              return (i % divisor === 0 && format(',d')(Number(d))) || '';
            })
        );

      setSizeChart.append('g')
        .classed('set-size-label', true)
        .attr(
          'transform',
          `translate(${this.innerMargin}, -${this.margins().top + this.innerMargin})`
        )
        .append('text')

        .text(() => {
          if (this.chartData() && this.chartData()!.rowLabel) {
            return <string>this.chartData()!.rowLabel;
          } else {
            const defaultLabel = 'Set Size';
            const scale = this.scale() === 'log' ? ` (log scale)` : '';
            return defaultLabel + scale;
          }
        });
      return setSizeChart
    }
    else return undefined
  });

  intersectionSizeChartScale = computed(() => {
    if (this.staticSvg()) {
      const chart = this.staticSvg()!.select('.top-row-left-column')
      chart
      .append('g')
        .classed('intersection-size-scale', true)
        .call(
          axisLeft(this.intersectionSizeScale())
           .scale(this.intersectionSizeScale())
            .tickFormat((d, i) => {
              const divisor = this.scale() === 'log' ? 5 : 2
              return (i % divisor === 0 && format(',d')(Number(d))) || '';
            })
            .tickSize(5)
        )
        .attr("height", this.topRowHeight())
        .attr('transform', `translate(${this.leftColWidth()}, ${this.margins().top})`)

      chart
        .append('g')
        .classed('intersection-size-label', true)
        .attr('transform', () => ` translate( ${this.leftColWidth()-this.margins().left}, ${this.topRowHeight()})`)
        .append('text')
        .text(() => {
          if (this.chartData() && this.chartData()!.columnLabel) {
            return <string>this.chartData()!.columnLabel;
          } else {
            const defaultLabel = 'Intersection Size';
            const scale = this.scale() === 'log' ? ` (log scale)` : '';
            return defaultLabel + scale;
          }
        })
        .attr('transform', () => `rotate(-90)`);
      return chart;
    } else return undefined;
  });

  intersectionSizeChartBars = computed(() => {
    const svg = this.scrollSvg()
    if(svg) {
      const topRowRightColumn = svg.select('.top-row-right-column')
        topRowRightColumn
          .append('svg:g')
          .classed('intersection-size', true)
          .selectAll('.bar-group')
          .data(this.chartData()!.data)
          .join((enter) => {
            const g = enter.append('g').classed('bar-group', true);

            g.append('rect')
              .attr('class', 'bar')
              .attr('height', (d) => {
                let ret = this.intersectionSizeScale()(d.size);
                if (!ret) {
                  ret = 0;
                }
                return this.topRowHeight() - ret;
              })
              .attr('width', this.xScale().bandwidth())
              .attr('x', (d: UpsetData) => <number>this.xScale()(<string>d.id))
              .attr('y', (d) => {
                let ret = this.intersectionSizeScale()(d.size);
                if (!ret) {
                  ret = 0;
                }
                return ret;
              });

            g.append('g')
              .classed('bar-labels', true)
              .attr('text-anchor', (d) => (d.size < 0 ? 'end' : 'start'))
              .attr('font-size', '1em')
              .append('text')
              .attr('x', (d: UpsetData) => {
                return <number>this.xScale()(<string>d.id)
              })
              .attr('y', (d: UpsetData) => {
                let scale: number = this.margins().top;
                let ret;
                if (d.size > 0) {
                  ret = this.intersectionSizeScale()(d.size);
                } else {
                  ret = this.intersectionSizeScale()(1);
                }
                if (ret) {
                  scale = scale + ret;
                }
                return scale - this.margins().top - 2;
              })
              .text((d: { size: number }) => format(',d')(Number(d.size)))
            ;

            g.append('rect')
              .attr('class', 'hover-column')
              .attr(
                'height',
                this.height()
              )
              .attr('width', this.xScale().bandwidth())
              .attr('x', (d: UpsetData) => <number>this.xScale()(<string>d.id))
              .attr('y', 0);

            g.on('mouseover', (event: MouseEvent, d) => {
              select((<unknown>event.currentTarget) as string)
                .classed('hovered', true)
                .classed('hovered-label', true)
                .transition()
                .duration(300);
              this.columnHovered(event, d);
            });

            g.on('mouseout', (event: Event, d: UpsetData) => {
              select((<unknown>event.currentTarget) as string)
                .classed('hovered', false)
                .transition()
                .duration(300);
              this.columnHoveredOff();
            });

            return g;
          });
      return svg;
    }else return undefined;
  });

  combinationMatrix = computed(() => {
    const svg = this.scrollSvg()
    if(svg) {
      const bottomRowRightColumn = svg.select('.bottom-row-right-column')

      const combinationMatrix =
        bottomRowRightColumn.append('svg:g')
          .classed('combination-matrix', true)

       combinationMatrix.selectAll('.combination')
         .data(this.chartData()!.data)
                  .join('svg:g')
         .attr('class', 'combination')
         .attr('transform', (d: UpsetData) => {
           let ret = this.xScale()(d.id);
           if (!ret) {
             ret = 0;
           }
           return `translate(${ret + this.xScale().bandwidth() / 2}, 0)`;
         })

       .selectAll('.non-set-circle')
         .enter()
         .data((combination) => combination.combinations.filter((d) => !d.member))
         .join('circle')
         .classed('non-set-circle', true)
         .attr(
           'cy',
           (d) =>
             (this.yCombinationScale()(<string>d.setId) as number) - this.margins().top
         )
         .attr('r', () => <number>min([7, this.yCombinationScale().bandwidth() / 3 + 1]))

      combinationMatrix.selectAll('.combination')
        .data(this.chartData()!.data)
    .filter((d) => d.connectorIndices.length > 0)
        .append('svg:line')
        .classed('connector', true)
        .attr('y1', (d) => {
          if (d.connectorIndices && <number>d.connectorIndices[1] > 0) {
            return (
              <number>(
                this.yCombinationScale()(
                  <string>(
                    this.chartData()!.allSetIds[<number>d.connectorIndices[0]].id
                  )
                )
              ) - this.margins().top
            );
          } else {
            return 0;
          }
        })
        .attr('y2', (d) => {
          if (d.connectorIndices && d.connectorIndices[1]) {
            return (
              <number>(
                this.yCombinationScale()(
                  <string>this.chartData()!.allSetIds[d.connectorIndices[1]].id
                )
              ) - this.margins().top
            );
          } else {
            return 0;
          }
        })

      combinationMatrix.selectAll('.combination')
        .data(this.chartData()!.data)
        .selectAll('.set-circle')
        .data((combination) => combination.combinations.filter((d) => d.member))
        .join('circle')
        .classed('set-circle', true)
        .attr(
          'cy',
          (d) =>
            (this.yCombinationScale()(<string>d.setId) as number) -this.margins().top
        )
        .attr('r', () => <number>min([7, this.yCombinationScale().bandwidth() / 3 + 1]))



      return combinationMatrix;
    } else return undefined;
  });


  /**
   * function to redraw/scale the graph on window resize
   */
  @HostListener('window:resize', [])
  onResize() {
    this.drawContainer();
  }

  constructor() {
    super();
    effect(() => {
      this.drawContainer();
    });
  }

  ngOnInit(): void {
    this.margins.set({ top: 20, bottom: 20, left: 30, right: 40 });
    if (this.isBrowser()) {
      if (this.chartData() && this.chartData()!.data.length > 0) {
        this.drawContainer();
      }
    }
  }

  drawContainer(): void {
    if (this.staticSvg()) {
      this.staticSvg()!.select('svg').remove();
    }
    if (this.scrollSvg()) {
      this.scrollSvg()!.select('svg').remove();
    }
    // computed signals aren't run unless they are called. This is a cheater method to call them and assign them.
    const svgObject = {
      chartElement: this.chartElement(),
      height: this.height(),
      svg: this.svg(),
      scrollSvg: this.scrollSvg(),
      staticSvg: this.staticSvg(),
      intersectionSizeChartBars: this.intersectionSizeChartBars(),
      intersectionSizeChartScale: this.intersectionSizeChartScale(),
      combinationMatrix: this.combinationMatrix(),
      setCountBarChart: this.setCountBarChart(),
    };
  }

  rowHovered(setName: string) {
    this.scrollSvg()!
      .selectAll('.set-circle')
      .classed('hovered-circle', (datum) => {
        const r = datum as { setId: string };
        return r.setId === setName;
      })
      .transition()
      .duration(100);
  }

  rowHoveredOff() {
    this.scrollSvg()!.selectAll('.set-circle')
      .classed('hovered-circle', false)
      .classed('hovered-row', false)
      .transition()
      .duration(100);
  }

  columnHovered(event: MouseEvent, d: UpsetData) {
    this.scrollSvg()!.selectAll('.combination')
      .classed('hovered', (datum) => {
        const r: UpsetData = datum as UpsetData;
        return d.id === r.id;
      })
      .transition()
      .duration(100);

const textString =  d.size.toLocaleString();
    this.tooltip.style('display', null);
   // const [mx, my] = pointer(event);
    const [mx, my] = [event.offsetX, event.offsetY];
    this.tooltip.attr('transform', `translate(${mx}, ${my})`);

    const path: Selection<
      BaseType | SVGPathElement,
      undefined,
      null,
      undefined
    > = this.tooltip
      .selectAll('path')
      // eslint-disable-next-line no-sparse-arrays
      .data([,])
      .join('path')
      .attr('fill', 'white')
      .attr('stroke', 'black');

    const text: Selection<
      BaseType | SVGTextElement,
      undefined,
      null,
      undefined
    > = this.tooltip
      .selectAll('text')
      .data([undefined,])
      .join('text')
      .call((text) =>
        text
          .attr('x', 0)
          .attr('y', (_, i) => `${i}em`)
          .attr('font-weight', (_, i) => (i ? null : 'bold'))
          .text(textString)
      );

    this.tooltip.transition().duration(100).style('opacity', 0.9);

    this.size(text, path);
  }

  columnHoveredOff() {
    this.scrollSvg()!.selectAll('.combination')
      .classed('hovered', false)
      .classed('hovered-row', false)
      .transition()
      .duration(100);
    this.tooltip.style('display', 'none');

  }

  private _getMax(): number {
    let maxN: number | undefined = max(
      this.chartData()!.data,
      (d: UpsetData) => (<number>d.size) as number
    );
    if (!maxN) {
      maxN = 0;
    }
    return maxN;
  }
}
