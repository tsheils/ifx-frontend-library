import { CommonModule, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
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
import { Filter, FilterCategory, Page } from "@ncats-frontend-library/models/utils";
import { DiseaseListComponent } from "@ncats-frontend-library/shared/rdas/disease-display";
import { RdasSearchComponent } from "@ncats-frontend-library/shared/rdas/rdas-search";
import { RdasTreeComponent } from "@ncats-frontend-library/shared/rdas/rdas-tree";
import { SharedUtilsFilterPanelComponent } from "@ncats-frontend-library/shared/utils/filter-panel";
import { LoadingSpinnerComponent } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { ScrollToTopComponent } from "@ncats-frontend-library/shared/utils/scroll-to-top";
import { SharedUtilsSelectedFilterListComponent } from "@ncats-frontend-library/shared/utils/selected-filter-list";
import { DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { fetchFilters, FiltersFacade } from "@ncats-frontend-library/stores/filter-store";
import { Subject, takeUntil } from "rxjs";

/**
 * navigation options to merge query parameters that are added on in navigation/query/facets/pagination
 */
const navigationExtras: NavigationExtras = {
  queryParamsHandling: "merge"
};

@Component({
  selector: "ncats-frontend-library-rdas-browse",
  templateUrl: "./rdas-browse.component.html",
  styleUrls: ["./rdas-browse.component.scss"],
  standalone: true,
  imports: [CommonModule, RdasTreeComponent, RdasSearchComponent, MatPaginatorModule,
    LoadingSpinnerComponent, DiseaseListComponent, ScrollToTopComponent, MatMenuModule,
    MatButtonModule, MatSelectModule, SharedUtilsFilterPanelComponent, SharedUtilsSelectedFilterListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RdasBrowseComponent implements OnInit, OnDestroy {

  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<boolean> = new Subject();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  page?: Page;
  loaded = false;
  diseases!: Signal<Disease[] | undefined>;
  diseaseTree!: DiseaseNode[] | undefined;
  filters: FilterCategory[] = [];
  sort = "COUNT_ARTICLES";
  selectedValues: Map<string, string[]> = new Map<string, string[]>();

  constructor(
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private diseaseFacade: DiseasesFacade,
    private filterFacade: FiltersFacade
  ) {
  }

  ngOnInit(): void {
    this.selectedValues.clear();
    this.fetchParameters();

    this.diseases = this.diseaseFacade.allDiseases$;

    this.router.events
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((e: Event) => {
        if (e instanceof NavigationEnd) {
          this.selectedValues.clear();
          this.fetchParameters();
        }
      });

    this.diseaseFacade.diseaseTree$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.diseaseTree = res;
          this.changeRef.markForCheck();
        }
      });

    this.diseaseFacade.page$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.page = res;
          this.changeRef.markForCheck();
        }
      });

    this.diseaseFacade.loaded$.pipe().subscribe(res => {
      this.loaded = res;
    });

    if (this.router.routerState.root.snapshot.queryParamMap.has("sort")) {
      const sort = this.router.routerState.root.snapshot.queryParamMap.get("sort");
      if (sort) {
        this.sort = sort;
      }
    }

    this.filterFacade.allFilters$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res && res.length) {
          const tempMap: Map<string, FilterCategory> = new Map<string, FilterCategory>();
          res.forEach(filter => tempMap.set(filter.label, filter));
          this.filters = [...tempMap.values()];
        }
      });


  }

  /**
   * change pages of list
   * @param event
   */
  paginationChanges(event: PageEvent): void {
    navigationExtras.queryParams = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      sort: this.sort
    };
    this._navigate(navigationExtras);
  }

  changeSort(event: MatSelectChange): void {
    this.sort = event.value;
    navigationExtras.queryParams = {
      sort: this.sort,
      direction: this.sort === "GardName" ? "ASC" : "DESC"
    };

    this._navigate(navigationExtras);
  }

  selectDisease(event: Disease): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: event.gardId
      }
    };
    this.router.navigate(["/disease"], navigationExtras);
  }

  filterChange(event: { label: string, term?: string, page?: number }): void {
    const skip = event.page ? event.page * 200 : 0;
    if (event.term) {
      this.filterFacade.dispatch(fetchFilters({ label: event.label, term: event.term, limit: 200, skip: 0 }));
    } else {
      this.filterFacade.dispatch(fetchFilters({ label: event.label, limit: 200, skip: skip }));
    }
  }

  filterPhenotypes(filter: { label: string; values: string[] } | null): void {
    let navigationExtras: NavigationExtras = {};
    if (filter && filter.values.length) {
      const newObj: { [key: string]: string } = {};
      Object.keys(filter).forEach((key, value) => {
        newObj[filter.label] = filter.values.join("&");
      });
      navigationExtras = {
        queryParams: { ...newObj },
        queryParamsHandling: "merge"
      };
    } else {
      if (this.router.routerState.snapshot.root.queryParamMap.has("sort")) {
        navigationExtras = {
          queryParams: {
            sort: this.router.routerState.snapshot.root.queryParamMap.get("sort"),
            direction: this.sort === "GardName" ? "ASC" : "DESC"
          }
        };
      }
    }
    this.router.navigate(["/diseases"], navigationExtras);
  }

  treeExpand(event: DiseaseNode): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        parentId: event.gardId
      }
    };
    this.router.navigate(["/diseases"], navigationExtras);
  }

  fetchParameters(): void {
    const params = this.router.routerState.root.snapshot.queryParamMap.keys.filter(key => !["sort", "pageIndex", "pageSize", "direction"].includes(key));
    if (params && params.length) {
      params.forEach(param => {
        const selectedValues: string | null = this.router.routerState.root.snapshot.queryParamMap.get(param);
        if (selectedValues) {
          this.selectedValues.set(param, selectedValues.split("&"));
          this.changeRef.markForCheck();
        }
      });
    } else {
      this.changeRef.markForCheck();
    }
  }

  updateFilters(filters: Map<string, string[]>): void {
    if (filters.has("phenotypes")) {
      const values = filters.get("phenotypes");
      if (values) {
        this.filterPhenotypes({ label: "phenotypes", values: values });
      }
    } else {
      this.filterPhenotypes({ label: "phenotypes", values: [] });
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
  ngOnDestroy(): void {
    this.diseaseTree = undefined;
    this.changeRef.markForCheck();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
