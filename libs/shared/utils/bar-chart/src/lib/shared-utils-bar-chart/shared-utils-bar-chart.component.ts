// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Component,
  ElementRef, Inject, InjectionToken,
  Input, OnChanges, OnInit, PLATFORM_ID, ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Filter, FilterCategory } from "@ncats-frontend-library/models/utils";
import {
  axisBottom,
  axisLeft, BaseType,
  index, InternMap,
  ScaleBand,
  scaleBand,
  ScaleLinear,
  SeriesPoint,
  stack,
  union
} from "d3";
import { max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import { Series } from "d3-shape";

interface ChartPoint extends SeriesPoint<{[key: string]: number}> {
  key?: string;
}

@Component({
  selector: 'lib-shared-utils-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-utils-bar-chart.component.html',
  styleUrls: ['./shared-utils-bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SharedUtilsBarChartComponent implements OnInit, OnChanges {
  @ViewChild('barChart', { static: true }) barChartElement!: ElementRef;
@Input() data!: FilterCategory;
svg!: Selection<BaseType, unknown, null, undefined>;
// tooltip: unknown;
width!: number;
height!: number;
margins: {top: number, bottom: number, left: number, right: number} = {top:20, bottom: 30, right: 30, left: 30}
  keys!: string[];
  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: InjectionToken<NonNullable<unknown>>,
  ){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

ngOnInit() {
  if (this.barChartElement && this.isBrowser) {
    const element = this.barChartElement.nativeElement;
    this.width = element.offsetWidth - this.margins.left - this.margins.right;
    this.height = element.offsetHeight - this.margins.top - this.margins.bottom;
    select(element).select('svg').remove();
    this.svg = select(element)
      .append("svg:svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

   /* this.tooltip = select(element)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")*/
    if(this.data) {
      this.makeChart();
    }
  }
}

ngOnChanges(){
  if(this.data && this.svg) {
    this.svg.selectAll('*').remove();
    if(this.data) {
      this.makeChart();
    }
    }
  }


  makeChart() {
     // Determine the series that need to be stacked.
     this.keys = [...new Set(this.data.values.map(d => d.term))].sort((a:string,b: string) => a.localeCompare(b))
    const seriesIndex: InternMap = index(this.data.values, (d:Filter) => d.term, (d:Filter) => d.label) as InternMap;
     const series = stack()
        .keys(union(this.data.values.map(d => d.label))) // distinct series keys, in input order
        .value((D: [string, InternMap<string, Filter>], key: string) => {
            const dKey =  D[1].get(key);
            if(dKey) {
              return dKey.count
            } else return 0
        }) // get value for each series key and stack
        (seriesIndex as Iterable<{ [key: string]: number; }>); // group by stack then series key
      // Prepare the scales for positional and color encodings.
      const x: ScaleBand<string> = scaleBand()
        .domain(this.keys)
        .range([this.margins.left, this.width - this.margins.right])
        .padding(0.1);

      const yMax: unknown = max(series, (d) => max(d, (d:ChartPoint) => d[1]));
      const y: ScaleLinear<number, number, never> = scaleLinear()
        .domain([0, <number>yMax])
        .rangeRound([this.height - this.margins.bottom, this.margins.top]);

    // Append a group for each series, and a rect for each element in the series.
    this.svg.append("g")
      .selectAll()
      .data(series)
      .join("g")
      .attr("class", 'bar-chart-fill')
      .attr("id", (d: {key: string}) => `${<string>d.key.replaceAll(' ', '-')}-fill`)
      .selectAll("rect")
      .data((D: Series<{ [key: string]: number }, string>) => D.map((d:ChartPoint) => (d.key = D.key, d)))
      .join("rect")
      .attr("x", (d: ChartPoint) => x(<string><unknown>d.data[0]))
      .attr("y", (d: number[]) => y(d[1]))
      .attr("height", (d: number[]) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
     // .on("mouseover", this.hovered)
     // .on("click", this.clicked);

   // this.svg.selectAll("rect").on("click", (event: Event, d:unknown) => this.clicked(event, d));

    // Append the horizontal axis.
    this.svg.append("g")
      .attr("transform", `translate(0,${this.height - this.margins.bottom})`)
      .call(axisBottom(x)
        .tickValues(x.domain().filter(function(d,i){ return !(i%4)})))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")



    // Append the vertical axis.
    this.svg.append("g")
      .attr("transform", `translate(${this.margins.left},0)`)
      .call(axisLeft(y)) //.ticks(null, "s"))


  }

/*  clicked(event: Event, d: unknown){
   // console.log(event)
  //  console.log(d)
   // this.getData(d.data)
  }

  hovered(event: Event, d: unknown){
  //  console.log(event)
  //  console.log(d.data)
   // this.getData(d.data)
  }*/

}
