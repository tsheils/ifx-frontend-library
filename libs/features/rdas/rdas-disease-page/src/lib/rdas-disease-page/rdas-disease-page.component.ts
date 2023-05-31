import { ChangeDetectorRef, Component, ContentChildren, OnInit, QueryList, ViewChildren } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { DiseaseDisplayComponent } from "@ncats-frontend-library/shared/rdas/disease-display";
import { ScrollToTopComponent } from "@ncats-frontend-library/shared/utils/scroll-to-top";
import { DiseasesFacade, fetchDisease } from "@ncats-frontend-library/stores/disease-store";
import { NgIf } from "@angular/common";
import { combineLatest } from "rxjs";

@Component({
    selector: 'ncats-frontend-library-rdas-disease-page',
    templateUrl: './rdas-disease-page.component.html',
    styleUrls: ['./rdas-disease-page.component.scss'],
    standalone: true,
    imports: [NgIf, DiseaseDisplayComponent, ScrollToTopComponent]
})
export class RdasDiseasePageComponent implements OnInit {
  disease!: Disease;
  loaded: boolean | unknown = false;

  @ContentChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
  @ViewChildren(MatPaginator) paginatorsVC!: QueryList<MatPaginator>;
  options = {
    gardId: '',
    source: 'article',
    options: {}
  };

  constructor(
    private diseaseFacade: DiseasesFacade,
    private changeRef: ChangeDetectorRef
  ) {
    console.log("new page");
  }

  ngOnInit(): void {
/*    combineLatest([this.diseaseFacade.selectedDiseases$, this.diseaseFacade.loaded$])
      .subscribe(res => {
          this.disease = res[0] as Disease;
          if(this.disease) {
            this.options.gardId = this.disease.gardId;
          }
         //   this.loaded = res[1];
          this.changeRef.markForCheck();
      })
    this.diseaseFacade.loaded$.subscribe(res => {
      console.log("loading: " + res);
      if(this.disease) {
        this.loaded = res
      }
    });*/

    this.diseaseFacade.selectedDiseases$.subscribe(res => {
        if (res) {
          this.disease = res;
          this.options.gardId = this.disease.gardId;
          this.changeRef.markForCheck();
        }
      }
    )
  }


  fetchDisease(disease: Disease) {
    this.options.gardId = disease.gardId;
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
    this.diseaseFacade.dispatch(fetchDisease(this.options));
  }

  fetchDiseaseInfo(options: any) {
    this.options.options = options.variables;
    this.options.source = options.origin;
    this.diseaseFacade.dispatch(fetchDisease(this.options));
  }

}
