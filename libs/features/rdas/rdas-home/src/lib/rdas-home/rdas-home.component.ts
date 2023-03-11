import ForceGraph3DInstance from "3d-force-graph";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { Disease } from "@ncats-frontend-library/models/rdas";
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';



/**
 * navigation options to merge query parameters that are added on in navigation/query/facets/pagination
 */
const navigationExtras: NavigationExtras = {
  queryParamsHandling: 'merge'
};


@Component({
  selector: 'ncats-frontend-library-rdas-home',
  templateUrl: './rdas-home.component.html',
  styleUrls: ['./rdas-home.component.scss']
})
export class RdasHomeComponent {

  data!: any;

  constructor(
    private router: Router,
    private http: HttpClient,
) { }


  ngOnInit() {
    const elem: HTMLElement | null = document.getElementById('3d-graph');
    if (elem) {
        this.http.get('/assets/rdas-home/graph.json').subscribe(data => {
          console.log(data);
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
          //scene.controls().
         console.log(scene.scene());
         console.log(scene.controls());
        //  scene.scene

         scene.camera().translateZ(2)
        })
    }
  }





  fetchDisease(disease: Disease) {
    navigationExtras.queryParams = {id: disease.gardId}
    this.router.navigate(['disease'], navigationExtras);
    /* this.options.gardId = disease.gardId;
     this.options.options = {
       mentionedInArticlesOptions: {
         limit: 10,
         offset: 0,
         sort: [
           {
             firstPublicationDate: "DESC"
           }
         ]
       },
     }
     console.log(this.options);
     this.diseaseFacade.dispatch(fetchDisease(this.options));*/
  }

}

