import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  ViewChild,
  WritableSignal
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { Event, NavigationEnd, NavigationExtras, Router } from "@angular/router";
import { Disease, DiseaseNode } from "@ncats-frontend-library/models/rdas";
import { Page } from "@ncats-frontend-library/models/utils";
import { SharedUtilsFilterPanelComponent } from "@ncats-frontend-library/shared/utils/filter-panel";
import { SharedUtilsSelectedFilterListComponent } from "@ncats-frontend-library/shared/utils/selected-filter-list";
import { DiseasesFacade, fetchPhenotypes } from "@ncats-frontend-library/stores/disease-store";
import { Subject, takeUntil } from "rxjs";
import { ScrollToTopComponent } from "@ncats-frontend-library/shared/utils/scroll-to-top";
import { DiseaseListComponent } from "@ncats-frontend-library/shared/rdas/disease-display";
import { LoadingSpinnerComponent } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { RdasSearchComponent } from "@ncats-frontend-library/shared/rdas/rdas-search";
import { RdasTreeComponent } from "@ncats-frontend-library/shared/rdas/rdas-tree";
import { NgIf } from "@angular/common";

/**
 * navigation options to merge query parameters that are added on in navigation/query/facets/pagination
 */
const navigationExtras: NavigationExtras = {
  queryParamsHandling: 'merge'
};

@Component({
    selector: 'ncats-frontend-library-rdas-browse',
    templateUrl: './rdas-browse.component.html',
    styleUrls: ['./rdas-browse.component.scss'],
    standalone: true,
    imports: [NgIf, RdasTreeComponent, RdasSearchComponent, MatPaginatorModule,
      LoadingSpinnerComponent, DiseaseListComponent, ScrollToTopComponent, MatMenuModule,
    MatButtonModule, MatSelectModule, SharedUtilsFilterPanelComponent, SharedUtilsSelectedFilterListComponent]
})
export class RdasBrowseComponent implements OnInit, OnDestroy {

  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<boolean> = new Subject();

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  page?: Page;
  loaded = false;
  diseases!: Signal<Disease[] | undefined>;
  diseaseTree!: DiseaseNode[] | undefined;
  phenotypeFilters!: { term: string, count: number}[];
  sort = "COUNT_ARTICLES";
  selectedValues: WritableSignal<Map<string, string[]>> = signal(new Map<string, string[]>());

  constructor(
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private diseaseFacade: DiseasesFacade
  ) { }

  ngOnInit(): void {
    this.selectedValues().clear();
    this.fetchParameters();
    this.diseaseFacade.dispatch(fetchPhenotypes({}))

    this.diseases = this.diseaseFacade.allDiseases$

    this.router.events
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((e:Event) => {
        if (e instanceof NavigationEnd) {
          console.log("navigationf")
          this.fetchParameters();
        }
      });

    this.diseaseFacade.diseaseTree$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
      if(res) {
        this.diseaseTree = res;
        this.changeRef.markForCheck()
      }
    });

    this.diseaseFacade.fetchPhenotypes$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if(res) {
          this.phenotypeFilters = res;
        }
      })

        this.diseaseFacade.page$
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(res => {
          if(res) {
            this.page = res;
            this.changeRef.markForCheck()
          }
        });

    this.diseaseFacade.loaded$.pipe().subscribe(res => {
      this.loaded = res;
    });

    if(this.router.routerState.root.snapshot.queryParamMap.has("sort")){
      const sort = this.router.routerState.root.snapshot.queryParamMap.get("sort");
      if(sort) {
        this.sort = sort
      }
    }

  }

  /**
   * change pages of list
   * @param event
   */
  paginationChanges(event: PageEvent) {
    navigationExtras.queryParams = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      sort: this.sort
    };
    this._navigate(navigationExtras);
  }

  changeSort(event: MatSelectChange) {
    this.sort = event.value;
    navigationExtras.queryParams = {
      sort: this.sort,
      direction: this.sort ==='GardName' ? "ASC" : "DESC"
    };

    this._navigate(navigationExtras);
  }

  selectDisease(event: Disease): void {
    const navigationExtras: NavigationExtras = {
      queryParams:{
        id: event.gardId
      }
    };
    this.router.navigate(['/disease'], navigationExtras);
  }

  filterPhenotypes(filter: { label: string; values: string[] } | null) {
    let navigationExtras: NavigationExtras = {};
    console.log(filter);
    if (filter && filter.values.length) {
      const newObj: { [key: string]: string } = {};

    Object.keys(filter).forEach((key, value) => {
      newObj[filter.label] = filter.values.join('&');
    })
     navigationExtras = {
      queryParams: { ...newObj },
      queryParamsHandling: "merge"
    };
  } else {
      console.log("filters cleared");
      if(this.router.routerState.snapshot.root.queryParamMap.has("sort" ) ){
         navigationExtras = {
          queryParams: {
            sort:this.router.routerState.snapshot.root.queryParamMap.get("sort"),
            direction: this.sort ==='GardName' ? "ASC" : "DESC"
          },
        };
      }
    }
    this.router.navigate(['/diseases'], navigationExtras);
  }

  treeExpand(event: DiseaseNode): void {
    const navigationExtras: NavigationExtras = {
      queryParams:{
        parentId: event.gardId
      }
    };
    this.router.navigate(['/diseases'], navigationExtras);
  }


  searchPhenotypes(term: string) {
    console.log(term);
    this.diseaseFacade.dispatch(fetchPhenotypes({term: term, limit: 100, skip: 0}))
  }

  fetchPhenotypesPage(page: number) {
    console.log(page);
    this.diseaseFacade.dispatch(fetchPhenotypes({limit: 100, skip: page*100}))
  }

fetchParameters() {
    console.log(this.router.routerState.root.snapshot.queryParamMap)
  const params = this.router.routerState.root.snapshot.queryParamMap.keys.filter(key => !['sort', 'pageIndex', 'pageSize', 'direction'].includes(key))
  console.log(params);
    if(params && params.length) {
      params.forEach(param => {
        const filterValues: string | null = this.router.routerState.root.snapshot.queryParamMap.get(param);
       console.log(filterValues)
        if(filterValues) {
          console.log(this.selectedValues)
          console.log(this.selectedValues())
          this.selectedValues.update(val => this.selectedValues().set(param, filterValues.split("&")))
          console.log(this.selectedValues())
          this.changeRef.markForCheck()
        }
      })
    } else {
      console.log("family removed")
      this.selectedValues.mutate(val => this.selectedValues().clear())
      this.changeRef.markForCheck()

    }
}

  updateFilters(filters: Map<string, string[]>) {
    console.log(filters);
    if(filters.has('phenotypes')) {
      const values =  filters.get('phenotypes');
      if(values) {
        this.filterPhenotypes({ label: 'phenotypes', values: values});
      }
    } else {
      this.filterPhenotypes({ label: 'phenotypes', values: []});
    }
  }


  /**
   * navigate on changes, mainly just changes url, shouldn't reload entire page, just data
   * @param {NavigationExtras} navExtras
   * @private
   */
  private _navigate(navExtras: NavigationExtras): void {
    this.router.navigate([], navExtras);
  }

  /**
   * clean up on leaving component
   */
  ngOnDestroy() {
    this.diseaseTree = undefined;
    this.changeRef.markForCheck()
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
