import { Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from '@angular/common';
import { select } from "d3-selection";
import { AmbientLight, DirectionalLight, Vector3, DragControls } from 'three';



@Component({
  selector: 'lib-utils-animated-force-directed-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './utils-animated-force-directed-graph.component.html',
  styleUrl: './utils-animated-force-directed-graph.component.css',
})
export class UtilsAnimatedForceDirectedGraphComponent {
  @ViewChild('animatedFDG', { static: true }) graphElement!: ElementRef;


  ngOnInit(){
    if (this.graphElement) {
      const element = this.graphElement.nativeElement;
   //   this.width = element.offsetWidth - this.margins.left - this.margins.right;
   //   this.height = element.offsetHeight - this.margins.top - this.margins.bottom;
   //   select(element).select('svg').remove();
  }

}
