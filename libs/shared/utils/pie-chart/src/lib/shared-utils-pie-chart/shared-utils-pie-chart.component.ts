// @ts-nocheck

import { CommonModule, isPlatformBrowser } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output, PLATFORM_ID,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { Filter, FilterCategory } from "@ncats-frontend-library/models/utils";
import { Arc, DefaultArcObject, interpolate, interpolateRgb, interpolateSpectral, Pie, quantize } from "d3";
import { scaleOrdinal } from "d3-scale";
import { select } from "d3-selection";
import { arc, pie } from "d3-shape";


@Component({
  selector: 'lib-shared-utils-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-utils-pie-chart.component.html',
  styleUrl: './shared-utils-pie-chart.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SharedUtilsPieChartComponent {
  @ViewChild('pieChart', { static: true }) pieChartElement!: ElementRef;
  @Input() data!: FilterCategory;
  svg: any;
  arcShape!:  Arc<any, DefaultArcObject>;
  pieChart!: Pie<any, number | {valueOf(): number}>;
  tooltip: any;
  width!: number;
  height!: number;
  radius!: number;
  margins: {top: number, bottom: number, left: number, right: number} = {top:20, bottom: 30, right: 30, left: 30}
  keys!: string[];
  color!: string[];

  /**
   * output event on slice click
   * @type {EventEmitter<any>}
   */
  @Output() readonly clickSlice: EventEmitter<any> = new EventEmitter<any>();

  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId){
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.pieChartElement && this.isBrowser) {
      const element = this.pieChartElement.nativeElement;
      this.width = element.offsetWidth - this.margins.left - this.margins.right;
      this.height = element.offsetHeight - this.margins.top - this.margins.bottom;

       this.radius = Math.min(this.width, this.height) / 2;

       this.arcShape = arc()
        .innerRadius(this.radius * 0.67)
        .outerRadius(this.radius - 1)
        .cornerRadius(3)
        .padAngle(.015);

       this.pieChart = pie()
        .padAngle(1 / this.radius)
        .sort(null)
        .value(d => d.count);

       this.color = scaleOrdinal()
        .domain(this.data.values.map(d => d.term))
        .range(quantize(interpolate("#93278f","#6e4c8f"), this.data.values.length).reverse());

      select(element).select('svg').remove();
      this.svg = select(element)
        .append("svg:svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

      this.tooltip = select(element)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
      this.makeChart();
    }
  }

  ngOnChanges(){
    if(this.data && this.svg) {
      this.svg.selectAll('*').remove();
      this.makeChart();
    }
  }


  makeChart() {
    this.svg.append("g")
      .attr('class', 'slices')
      .selectAll()
      .data(this.pieChart(this.data.values))
      .join("path")
      .attr("fill", d => this.color(d.data.term))
      .attr('class', 'slice')
      .attr("d", this.arcShape)
      .on('mouseover', (event, d) => {
        this.svg.selectAll('.toolCircle').remove();
        this.addTooltip(d);
      })
      .on('mouseout', (event, d) => {
        /*  div.transition()
            .duration(500)
            .style('opacity', 0);*/
      })
      .on('click', (event, d) => {
        this.clickSlice.emit(d.data);
      });
    const firstSlice = this.svg.select('.slices').selectAll('path.slice').data();
    this.addTooltip(firstSlice.reverse()[firstSlice.length-1]);
  }

  /**
   * add tooltip as donut chart center fill
   * @param element
   * @param d
   * @param color
   */
  addTooltip(d: any): void {
    if (!d){return; }
    this.svg.append('circle')
      .attr('class', 'toolCircle')
      .attr('r', this.radius * 0.65) // radius of tooltip circle
      .style('fill', this.color(d.data.term)) // colour based on category mouse is over
      .style('fill-opacity', 0.35);
    this.svg.append('text')
      .attr('class', 'toolCircle')
      .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip*/
      .html(d.data.term); // add text to the circle.
    this.svg.append('text')
      .attr('class', 'toolCircle value')
      .attr('dy', 30) // hard-coded. can adjust this to adjust text vertical alignment in tooltip*/
      .html(d.data.count);
    this.svg.transition()
      .duration(200)
      .style('opacity', .9);
  }


}
