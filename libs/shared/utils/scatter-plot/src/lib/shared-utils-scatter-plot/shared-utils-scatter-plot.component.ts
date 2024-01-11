// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { CommonModule } from "@angular/common";
import { afterNextRender, Component, Input, ViewEncapsulation } from "@angular/core";
import { Filter, FilterCategory } from "@ncats-frontend-library/models/utils";
import { LoadingSpinnerComponent } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { axisBottom, axisLeft } from "d3";
import { extent, max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { line } from "d3-shape";


@Component({
  selector: 'lib-shared-utils-scatter-plot',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './shared-utils-scatter-plot.component.html',
  styleUrls: ['./shared-utils-scatter-plot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SharedUtilsScatterPlotComponent {
  @Input() filter!: FilterCategory;
  svg!: unknown;
  width!: number;
  height!: number;
  margins: {top: number, bottom: number, left: number, right: number} = {top:20, bottom: 30, right: 30, left: 40}

  constructor() {
    afterNextRender(
      () => {
        const element: HTMLElement | null = document.getElementById('scatter-plot');
        if (element) {
          this.width = element.offsetWidth - this.margins.left - this.margins.right;
          this.height = element.offsetHeight - this.margins.top - this.margins.bottom;
          select(element).select('svg').remove();
           this.svg = select(element)
             .append("svg:svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", [0, 0, this.width, this.height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

          this.makeChart();
        }
      }
    )
  }

  makeChart(){
      // Declare the x (horizontal position) scale.
      const x = scaleLinear(extent(this.filter.values.map((d: Filter) => <number>d.term)), [this.margins.left, this.width - this.margins.right]);

      // Declare the y (vertical position) scale.
      const y = scaleLinear([0, max(this.filter.values, (d: Filter) => d.count)], [this.height - this.margins.bottom, this.margins.top]);

      // Declare the line generator.
       const lineFunction = line()
         .x((d: Filter) => x(<string>d.term))
         .y((d: Filter) => y(<number>d.count));

      // Create the SVG container.

      // Add the x-axis.
      this.svg.append("g")
        .attr("transform", `translate(0,${this.height - this.margins.bottom})`)
        .call(axisBottom(x)
        .ticks(this.filter.values.length/3)
            .tickFormat(d => d.toString())
        );
    //.ticks(width / 80).tickSizeOuter(0));

      // Add the y-axis, remove the domain line, add grid lines and a label.
     this.svg.append("g")
        .attr("transform", `translate(${this.margins.left},0)`)
        .call(axisLeft(y))//.ticks(this.height / 40))
        .call((g) => g.select(".domain").remove())
        .call((g) => g.selectAll(".tick line").clone()
          .attr("x2", this.width - this.margins.left - this.margins.right)
          .attr("stroke-opacity", 0.1))

      // Append a path for the line.
      this.svg.append("path")
        .attr("fill", "none")
        .attr("class", "scatter-line")
        .attr("stroke-width", 2.5)
        .attr("d", lineFunction(this.filter.values));

  }
}
