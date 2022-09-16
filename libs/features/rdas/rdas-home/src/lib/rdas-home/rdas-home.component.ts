import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from "@angular/router";


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

  constructor(
    private router: Router
  ) { }

  fetchDisease(disease: any) {
    navigationExtras.queryParams = {id: disease.gard_id}
    this.router.navigate(['disease'], navigationExtras);
    /* this.options.gard_id = disease.gard_id;
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

