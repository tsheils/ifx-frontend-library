import { Component } from '@angular/core';
import { NavigationExtras, Router } from "@angular/router";
import { Disease } from "@ncats-frontend-library/models/rdas";


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

