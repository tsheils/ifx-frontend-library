import ForceGraph3D, { ForceGraph3DInstance } from "3d-force-graph";
import { CdkScrollable } from "@angular/cdk/overlay";
import { CdkScrollableModule, ScrollingModule } from "@angular/cdk/scrolling";
import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";

@Component({
    selector: 'ncats-frontend-library-rdas-home',
    templateUrl: './rdas-home.component.html',
    styleUrls: ['./rdas-home.component.scss'],
    standalone: true,
    imports: [MatIconModule, MatCardModule, ScrollingModule, CdkScrollableModule],
  encapsulation: ViewEncapsulation.None
})
export class RdasHomeComponent implements OnInit {
  @ViewChild(CdkScrollable, {static: false}) scrollable!: CdkScrollable;

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
        this.http.get('/assets/rdas-home/graph.json').subscribe((data: unknown) => {
          const distance = 1400;
          const scene: ForceGraph3DInstance = ForceGraph3D()(elem)
            .graphData(<never>data)
            .backgroundColor('rgba(255,255,255,.01)')
            .nodeAutoColorBy('label')
            .nodeVal('size')
            .nodeRelSize(7)
            .nodeOpacity(9)
            .linkColor('#000000')
            .linkWidth('weight')
            .showNavInfo(false)

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ctls: any = scene.controls();
          ctls.maxDistance = 750

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

