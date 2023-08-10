import { CdkScrollable } from "@angular/cdk/overlay";
import { CdkScrollableModule, ScrollingModule } from "@angular/cdk/scrolling";
import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import ForceGraph3D from '3d-force-graph';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { map } from "rxjs";

@Component({
    selector: 'ncats-frontend-library-rdas-home',
    templateUrl: './rdas-home.component.html',
    styleUrls: ['./rdas-home.component.scss'],
    standalone: true,
    imports: [MatIconModule, MatCardModule, ScrollingModule, CdkScrollableModule]
})
export class RdasHomeComponent {
  @ViewChild(CdkScrollable, {static: false}) scrollable!: CdkScrollable;

  data!: any;
  /**
   * element of the page to scroll to
   */
  @ViewChild('details', {read: ElementRef, static: true}) elemRef!: ElementRef;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }


  ngOnInit() {
    const elem: HTMLElement | null = document.getElementById('3d-graph');
    if (elem) {
        this.http.get('/assets/rdas-home/graph.json').subscribe((data: any) => {
          const distance = 1400;
          const scene: any = ForceGraph3D()(elem)
            .graphData(<{nodes: any, links: any}>data)
            .backgroundColor('rgba(255,255,255,.01)')
            .nodeAutoColorBy('label')
            .nodeVal('size')
            .nodeRelSize(7)
            .nodeOpacity(9)
            .linkColor('#000000')
            .linkWidth('weight')
            .showNavInfo(false)

          scene.controls().maxDistance = 750

          let angle = 0;
          setInterval(() => {
            scene.cameraPosition({
              x: distance * Math.sin(angle),
              z: distance * Math.cos(angle)
            });
            angle += Math.PI / 500;
          }, 20)

        })
    }
  }

  /**
   * scroll to details section of the home page
   */
  goToDetails(): void {
    this.elemRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}

