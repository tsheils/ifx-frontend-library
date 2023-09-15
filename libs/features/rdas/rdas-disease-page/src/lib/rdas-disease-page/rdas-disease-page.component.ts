import {
  ChangeDetectorRef,
  Component, computed,
  ContentChildren, HostListener,
  Input,
  OnInit,
  QueryList,
  Signal,
  ViewChildren, WritableSignal
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { ActivatedRoute } from "@angular/router";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { DiseaseDisplayComponent } from "@ncats-frontend-library/shared/rdas/disease-display";
import { ScrollToTopComponent } from "@ncats-frontend-library/shared/utils/scroll-to-top";
import { DiseasesFacade, fetchDisease } from "@ncats-frontend-library/stores/disease-store";
import { NgIf } from "@angular/common";

@Component({
    selector: 'ncats-frontend-library-rdas-disease-page',
    templateUrl: './rdas-disease-page.component.html',
    styleUrls: ['./rdas-disease-page.component.scss'],
    standalone: true,
    imports: [NgIf, DiseaseDisplayComponent, ScrollToTopComponent]
})
export class RdasDiseasePageComponent implements OnInit {
  @Input() disease!: Signal<Disease | undefined>;
  loaded = computed(() => this.disease()?.gardId === this.route.snapshot.queryParams['id']);

  @ContentChildren(MatPaginator) paginators!: QueryList<MatPaginator>;
  @ViewChildren(MatPaginator) paginatorsVC!: QueryList<MatPaginator>;
  options = {
    gardId: '',
    source: 'article',
    options: {}
  };

  constructor(
    private diseaseFacade: DiseasesFacade,
    private changeRef: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
  }
  @HostListener('unloaded')
  ngOnDestroy() {
    console.log('Items destroyed');
    console.log(this.disease());
     // this.loaded = false;
  }

  ngOnInit(): void {
   this.disease = this.diseaseFacade.selectedDiseases$

    console.log(this.disease);
   console.log(this.disease());
   console.log(this);

    /* .subscribe(res => {
        if (res) {
          this.disease = res;
          this.options.gardId = this.disease.gardId;
          this.changeRef.detectChanges();
        }
      }
    )*/
    /*if (this.route.snapshot.fragment) {
      if (this.route.snapshot.queryParamMap.has('offset')) {
        const offset = +-this.route.snapshot.queryParamMap.has('offset');
        if (offset) {
          this.fetchDiseaseInfo({variables: { offset: offset }, origin: this.route.snapshot.fragment})
        }
      }
    }*/
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

  fetchDiseaseInfo(options: {variables: { [key: string]: unknown }, origin: string}) {
    this.options.options = options.variables;
    this.options.source = options.origin;
    this.diseaseFacade.dispatch(fetchDisease(this.options));
  }

}
