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
import { axisBottom, axisTop } from 'd3';
import { GenericChartComponent } from 'generic-chart';
import { select, selectAll } from 'd3-selection';
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

  leftColWidth = computed(() => this.width() * 0.33);
  rightColWidth = computed(
    () => this.width() - this.leftColWidth() - this.innerMargin
  );

  topRowHeight = computed(() => this.getHeight() * 0.7 - this.margins().top - this.margins().bottom);
  bottomRowHeight = computed(
    () =>
      this.getHeight() -
      this.topRowHeight() -
      this.innerMargin -
      this.margins().bottom * 2
  );

  // scale for intersection bar height
  intersectionSizeScale = computed(() => {
    let intersectionScale;
    if (this.scale() === 'log') {
      intersectionScale = scaleLog()
        .domain([1, this._getMax()]).nice()
        .range([this.topRowHeight(), 0]);
    } else {
      intersectionScale = scaleLinear()
        .domain([0, this._getMax()]).nice()
        .range([this.topRowHeight(), 0]);
    }
    console.log(intersectionScale)
    return intersectionScale;
  });

  //scale for set size bar chart
  setSizeScale = computed(() => {
    let setScale;
    if (this.scale() === 'log') {
      setScale = scaleLog()
        .domain([
          <number>(
            max(
              this.chartData()!.allSetIds,
              (d: { id: string; count: number }) => {
                return d.count;
              }
            )
          ),
          1,
        ])
        .range([0, this.leftColWidth()*.70]);
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
        .range([0, this.leftColWidth()*.70]);
    }
    return setScale;
  });

  // scale for intersection bar width
  xScale = computed(() =>
    scaleBand()
      .domain(this.chartData()!.data.map((d) => d.id))
      .range([0, this.rightColWidth()])
      .paddingInner(0.2)
  );

  // scale for set row height
  yCombinationScale = computed(() =>
    scaleBand()
      .domain(this.chartData()!.allSetIds.map((set) => set.id))
      .range([0, this.bottomRowHeight()])
      .paddingInner(0.2)
  );

  // Prepare the overall layout
  override svg = computed(() => {
    if (this.chartElement()?.nativeElement) {
      const svg = select(this.chartElement()!.nativeElement)
        .append('svg:svg')
        .attr('width', this.width())
        .attr('height', this.getHeight())
        .attr('viewBox', [0, 0, this.width(), this.getHeight()])
        .attr('style', 'max-width: 100%; height: auto;')

       const topRow = svg.append('svg:g')
        .classed('top-row', true)
         .attr(
           'transform',
           `translate(0, ${this.margins().top + this.margins().bottom})`
         );

        const tlc =  topRow.append('svg:g')
        .classed('top-row-left-column', true)

            tlc.append('svg:g')
            .classed('intersection-size', true)
            .attr(
              'transform',
              `translate(${this.leftColWidth()-this.margins().left}, 0)`
            );

        tlc.append('svg:g')
            .classed('set-size', true)
          .attr(
              'transform',
              `translate(0, ${this.topRowHeight()-this.margins().top + this.margins().bottom})`
            );

         topRow.append('svg:g')
        .attr('id', 'top-row-right-column')
        .classed('top-row-right-column', true)
        .attr(
          'transform',
          `translate(${this.leftColWidth()}, 0)`
        )

         ;

      const bottomRow = svg
        .append('svg:g')
        .classed('bottom-row', true)
        .attr(
          'transform',
          `translate(0, ${this.topRowHeight() + ((this.margins().top + this.margins().bottom)*2)})`
        )

     const lc =  bottomRow.append('svg:g')
        .classed('bottom-row-left-column', true)
       .attr(
         'transform',
         `translate(0, -${this.margins().top + this.margins().bottom})`
       );

       lc.append('svg:g')
        .classed('set-size-chart', true)
      lc.append('svg:g')
        .classed('set-names', true)
        .attr(
          'transform',
          `translate(${this.leftColWidth()*.70 - this.margins().right - this.margins().left}, 0)`
        );
      bottomRow.append('svg:g')
        .classed('bottom-row-right-column', true)
        .attr(
          'transform',
          `translate(${this.leftColWidth()}, 0)`
        );
      return svg
    } else return undefined;
  });


  setCountBarChart = computed(() => {
    if (this.svg()) {
      const setSizeChart = this.svg()!.select('.set-size-chart')
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
            .append('text')
            .classed('set-bar-labels', true)
            .attr('text-anchor', (d) => (d.count < 0 ? 'end' : 'start'))
            .attr('font-size', '1em')
            .attr(
              'x',
              (d: { count: number; id: string }) => {
                let ret = this.setSizeScale()(<number>d.count);
                if (!ret) {
                  ret = this.leftColWidth() * 0.6;
                }

                return this.leftColWidth() * 0.6 - ret
              }
            )
            .attr('y', (d) => {
              let ret = this.yCombinationScale()(d.id);
              if (!ret) {
                ret = 0;
              }
              return ret + ((this.bottomRowHeight() / (this.chartData()!.allSetIds.length + 1)) / 2) //+ this.innerMargin *2;
            })
            .text((d) => format(',d')(Number(d.count)));
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
              this.bottomRowHeight() / (this.chartData()!.allSetIds.length + 1)
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
               this.bottomRowHeight() / (this.chartData()!.allSetIds.length + 1)
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


      const setNames = this.svg()!.select('.set-names')
      setNames
        .append('svg:g')
        .classed('set-name-list', true)
        .selectAll('.set-name')
        .data(() => {
          const chartData = this.chartData() as UpsetPlot;
          return chartData.allSetIds;
        })
        .join((enter) => {
          console.log(enter)
          const group = enter.append('g').classed('set-name-group', true);
          group
            .append('text')
            .classed('set-name', true)
            .attr('text-anchor', 'start')
            .attr('font-size', '1em')
            .attr('x', 0)
            .attr('y', (d) => {
              let ret = this.yCombinationScale()(d.id);
              if (!ret) {
                ret = 0;
              }
              return ret + ((this.bottomRowHeight() / (this.chartData()!.allSetIds.length + 1)) / 2) //+ this.innerMargin *2;
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
            `translate(-${(this.leftColWidth()/10) - this.margins().left - this.margins().right}, 0)`
          )
        .call(
          axisTop(scaleCopy)
            .tickFormat((d, i) => {
              return (i % 5 === 0 && format(',d')(Number(d))) || '';
            })
            .tickSize(5)
            .ticks(4)
        );

      setSizeChart.append('g')
        .classed('set-size-label', true)
        .attr(
          'transform',
          () =>
            ` translate(${
              setSizeScale.node()!.getBBox().width -
              this.leftColWidth() * 0.4
            }, 0)`
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
    if (this.svg()) {
      const chart = this.svg()!.select('.intersection-size')
      console.log(chart)
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
        chart
        .append('g')
        .classed('intersection-size-label', true)
        .attr('transform', () => {
          let chartScaleNodeBBox = 0;
          const chartScaleNode = <unknown>chart.node() as SVGElement;
          if (chartScaleNode && chartScaleNode.getBoundingClientRect()) {
            chartScaleNodeBBox = chartScaleNode.getBoundingClientRect().width;
          }
          return ` translate( ${
            -chartScaleNodeBBox - this.innerMargin * 2
          }, ${this.topRowHeight()})`;
        })
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
    const svg = this.svg()
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
                return <number>this.xScale()(<string>d.id) + (this.xScale().bandwidth() / 2)
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
              .text((d: { size: number }) => format(',d')(Number(d.size)));

            g.append('rect')
              .attr('class', 'hover-column')
              .attr(
                'height',
                this.getHeight() - this.margins().top - this.margins().bottom
              )
              .attr('width', this.xScale().bandwidth())
              .attr('x', (d: UpsetData) => <number>this.xScale()(<string>d.id))
              .attr('y', 0);

            g.on('mouseover', (event: Event, d) => {
              select((<unknown>event.currentTarget) as string)
                .classed('hovered', true)
                .transition()
                .duration(300);
              this.columnHovered(d);
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
    const svg = this.svg()
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
             (this.yCombinationScale()(<string>d.setId) as number) -
             this.innerMargin
         )
         .attr('r', () => this.yCombinationScale().bandwidth() / 4 + 1)

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
              ) - this.innerMargin
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
              ) - this.innerMargin
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
            (this.yCombinationScale()(<string>d.setId) as number) -
            this.innerMargin
        )
        .attr('r', () => this.yCombinationScale().bandwidth() / 4 + 1);



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
    this.margins.set({ top: 20, bottom: 20, left: 5, right: 5 });
    if (this.isBrowser()) {
      if (this.chartData() && this.chartData()!.data.length > 0) {
        this.drawContainer();
      }
    }
  }

  drawContainer(): void {
    if (this.svg()) {
      this.svg()!.select('svg').remove();
    }
    // computed signals aren't run unless they are called. This is a cheater method to call them and assign them.
    const svgObject = {
      chartElement: this.chartElement(),
      height: this.getHeight(),
      svg: this.svg(),
      intersectionSizeChartBars: this.intersectionSizeChartBars(),
      intersectionSizeChartScale: this.intersectionSizeChartScale(),
      combinationMatrix: this.combinationMatrix(),
      setCountBarChart: this.setCountBarChart(),
    };
  }

  rowHovered(setName: string) {
    this.svg()!
      .selectAll('.set-circle')
      .classed('hovered-circle', (datum) => {
        const r = datum as { setId: string };
        return r.setId === setName;
      })
      .transition()
      .duration(100);
  }

  rowHoveredOff() {
    this.svg()!.selectAll('.set-circle')
      .classed('hovered-circle', false)
      .classed('hovered-row', false)
      .transition()
      .duration(100);
  }

  columnHovered(d: UpsetData) {
    this.svg()!.selectAll('.combination')
      .classed('hovered', (datum) => {
        const r: UpsetData = datum as UpsetData;
        return d.id === r.id;
      })
      .transition()
      .duration(100);
  }

  columnHoveredOff() {
    this.svg()!.selectAll('.combination')
      .classed('hovered', false)
      .classed('hovered-row', false)
      .transition()
      .duration(100);
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
