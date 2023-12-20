// @ts-nocheck

import {
  Component,
  ElementRef,
  Input, OnChanges, OnInit, ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { CommonModule } from '@angular/common';
import { FilterCategory } from "@ncats-frontend-library/models/utils";
import { axisBottom, axisLeft, index, scaleBand, stack, union } from "d3";
import { max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";

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
svg: any;
tooltip: any;
width!: number;
height!: number;
margins: {top: number, bottom: number, left: number, right: number} = {top:20, bottom: 30, right: 30, left: 30}
  keys!: string[];

  constructor() {}

ngOnInit() {
  if (this.barChartElement) {
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
     // Determine the series that need to be stacked.
     this.keys = [...new Set(this.data.values.map(d => d.term))].sort((a,b) => a - b)
      const series = stack()
        .keys(union(this.data.values.map(d => d.label))) // distinct series keys, in input order
        .value(([, D], key) => {
          if(D.has(key)){
            return D.get(key).count
          }
            else return 0
        }) // get value for each series key and stack
        (index(this.data.values, d => d.term, d => d.label)); // group by stack then series key

      // Prepare the scales for positional and color encodings.
      const x = scaleBand()
        .domain(this.keys)
        .range([this.margins.left, this.width - this.margins.right])
        .padding(0.1);

      const y = scaleLinear()
        .domain([0, max(series, d => max(d, d => d[1]))])
        .rangeRound([this.height - this.margins.bottom, this.margins.top]);

    // Append a group for each series, and a rect for each element in the series.
    this.svg.append("g")
      .selectAll()
      .data(series)
      .join("g")
      .attr("class", 'bar-chart-fill')
      .attr("id", d => `${d.key.replaceAll(' ', '-')}-fill`)
      .selectAll("rect")
      .data(D => D.map(d => (d.key = D.key, d)))
      .join("rect")
      .attr("x", d => x(d.data[0]))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", this.hovered)
      .on("click", this.clicked);

    this.svg.selectAll("rect").on("click", (event, d) => this.clicked(event, d));

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

  clicked(event, d){
    console.log(event)
    console.log(d)
   // this.getData(d.data)
  }

  hovered(event, d){
    console.log(event)
    console.log(d.data)
   // this.getData(d.data)
  }

}
