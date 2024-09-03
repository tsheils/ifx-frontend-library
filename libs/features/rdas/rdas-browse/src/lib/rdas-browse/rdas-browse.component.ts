import {
  BreakpointObserver,
  Breakpoints,
  MediaMatcher,
} from '@angular/cdk/layout';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { CommonModule, DOCUMENT, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import {
  Event,
  NavigationEnd,
  NavigationExtras,
  NavigationStart,
  Router,
} from '@angular/router';
import {
  Disease,
  DiseaseNode,
  GeneAssociation,
} from '@ncats-frontend-library/models/rdas';
import { FilterCategory, Page } from '@ncats-frontend-library/models/utils';
import { DiseaseListComponent } from '@ncats-frontend-library/shared/rdas/disease-display';
import { RdasSearchComponent } from '@ncats-frontend-library/shared/rdas/rdas-search';
import { RdasTreeComponent } from '@ncats-frontend-library/shared/rdas/rdas-tree';
import { ChartWrapperComponent } from '@ncats-frontend-library/shared/utils/chart-wrapper';
import { SharedUtilsFilterPanelComponent } from '@ncats-frontend-library/shared/utils/filter-panel';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { ScrollToTopComponent } from '@ncats-frontend-library/shared/utils/scroll-to-top';
import { SharedUtilsSelectedFilterListComponent } from '@ncats-frontend-library/shared/utils/selected-filter-list';
import {
  FetchFiltersActions,
  FilterSelectors,
} from '@ncats-frontend-library/stores/filter-store';
import {
  BrowseDiseaseListActions,
  DiseaseSelectors,
} from '@ncats-frontend-library/stores/disease-store';
import { Store } from '@ngrx/store';
import { map, Subject } from 'rxjs';
import { temp } from 'three/examples/jsm/nodes/core/VarNode';

/**
 * navigation options to merge query parameters that are added on in navigation/query/facets/pagination
 */
const navigationExtras: NavigationExtras = {
  queryParamsHandling: 'merge',
};

@Component({
  selector: 'ncats-frontend-library-rdas-browse',
  templateUrl: './rdas-browse.component.html',
  styleUrls: ['./rdas-browse.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RdasTreeComponent,
    RdasSearchComponent,
    MatPaginatorModule,
    LoadingSpinnerComponent,
    DiseaseListComponent,
    ScrollToTopComponent,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatButtonModule,
    MatSelectModule,
    SharedUtilsFilterPanelComponent,
    SharedUtilsSelectedFilterListComponent,
    ChartWrapperComponent,
    NgOptimizedImage,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class RdasBrowseComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  paginator = viewChild<MatPaginator>(MatPaginator);
  destroyRef = inject(DestroyRef);
  private router = inject(Router);
  protected dom = inject(DOCUMENT);

  filterMap: Signal<Map<string, FilterCategory[]>> = computed(() => {
    const map = new Map<string, FilterCategory[]>();
    const filtersL = this.store.selectSignal(
      DiseaseSelectors.getAllDiseaseFilters,
    );
    if (filtersL() && filtersL()?.length) {
      filtersL()?.forEach((filterCat) => {
        if (filterCat.parent) {
          let filterCats: FilterCategory[] | undefined = map.get(
            filterCat.parent,
          );
          if (filterCats) {
            filterCats.push(filterCat);
          } else {
            filterCats = [filterCat];
          }
          map.set(filterCat.parent, filterCats);
        }
      });
    }
    return map;
  });
  page = this.store.selectSignal(DiseaseSelectors.getDiseasesPage);
  loaded = this.store.selectSignal(DiseaseSelectors.getDiseasesLoaded);
  diseases = this.store.selectSignal(DiseaseSelectors.getAllDiseases);
  diseaseTree = this.store.selectSignal(DiseaseSelectors.getDiseaseTree);
  filters = this.store.selectSignal(FilterSelectors.selectAllFilters);

  mobileQuery!: MediaQueryList;

  sort = 'COUNT_ARTICLES';
  selectedValues: Map<string, string[]> = new Map<string, string[]>();
  showDownload = false;

  private _mobileQueryListener: () => void;

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.selectedValues.clear();
    this.fetchParameters();

    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e: Event) => {
        if (e instanceof NavigationStart) {
          this.store.dispatch(BrowseDiseaseListActions.setLoading());
        }
        if (e instanceof NavigationEnd) {
          this.selectedValues.clear();
          this.fetchParameters();
        }
      });

    if (this.router.routerState.root.snapshot.queryParamMap.has('sort')) {
      const sort =
        this.router.routerState.root.snapshot.queryParamMap.get('sort');
      if (sort) {
        this.sort = sort;
      }
    }
  }

  /**
   * change pages of list
   * @param event
   */
  paginationChanges(event: PageEvent): void {
    navigationExtras.queryParams = {
      pageIndex: event.pageIndex + 1,
      pageSize: event.pageSize,
      sort: this.sort,
    };
    this._navigate(navigationExtras);
  }

  changeSort(event: MatSelectChange): void {
    this.sort = event.value;
    navigationExtras.queryParams = {
      sort: this.sort,
      direction: this.sort === 'GardName' ? 'ASC' : 'DESC',
    };

    this._navigate(navigationExtras);
  }

  selectDisease(event: Disease): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: event.gardId,
      },
    };
    this.router.navigate(['/disease'], navigationExtras);
  }

  searchDiseaseString(event: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        q: event,
      },
    };
    this.router.navigate(['/diseases'], navigationExtras);
  }

  filterChange(event: { label: string; term?: string; page?: number }): void {
    const skip = event.page ? event.page * 200 : 0;
    if (event.term) {
      this.store.dispatch(
        FetchFiltersActions.fetchFilters({
          label: event.label,
          term: event.term,
          limit: 200,
          skip: 0,
        }),
      );
    } else {
      this.store.dispatch(
        FetchFiltersActions.fetchFilters({
          label: event.label,
          limit: 200,
          skip: skip,
        }),
      );
    }
  }

  filterSelectionChange(filters: { label: string; values: string[] }[]): void {
    let navigationExtras: NavigationExtras = { queryParamsHandling: 'merge' };
    const newObj: { [key: string]: string | null } = {};
    if (this.router.routerState.snapshot.root.queryParamMap.has('sort')) {
      navigationExtras = {
        queryParams: {
          sort: this.router.routerState.snapshot.root.queryParamMap.get('sort'),
          direction: this.sort === 'GardName' ? 'ASC' : 'DESC',
        },
      };
    }
    filters.forEach((filter) => {
      if (filter.values.length) {
        newObj[filter.label] = filter.values.join('&');
      } else {
        newObj[filter.label] = null;
      }
    });
    navigationExtras.queryParams = { ...newObj };
    this.router.navigate(['/diseases'], navigationExtras);
  }

  treeExpand(event: DiseaseNode): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        parentId: event.gardId,
      },
    };
    this.router.navigate(['/diseases'], navigationExtras);
  }

  fetchParameters(): void {
    const params =
      this.router.routerState.root.snapshot.queryParamMap.keys.filter(
        (key) => !['sort', 'pageIndex', 'pageSize', 'direction'].includes(key),
      );
    if (params && params.length) {
      params.forEach((param) => {
        const selectedValues: string | null =
          this.router.routerState.root.snapshot.queryParamMap.get(param);
        if (selectedValues) {
          this.selectedValues.set(param, selectedValues.split('&'));
        }
      });
    }
  }

  downloadData() {
    // if(this.diseases) {
    // this.diseasesFacade.dispatch()
    //this._downloadFile(this._toTSV(this.genes), 'rdas-genes-download.tsv')
    // }
  }

  _toTSV(data: GeneAssociation[]): string {
    // grab the column headings (separated by tabs)
    const headings: string = [
      'geneSymbol',
      'associationStatus',
      'associationType',
      'references',
    ].join('\t');

    // iterate over the data
    const rows: string = data
      .reduce(
        (acc, c) => {
          // for each row object get its values and add tabs between them
          // then add them as a new array to the outgoing array

          return acc.concat([c._toString()]);

          // finally joining each row with a line break
        },
        [headings],
      )
      .join('\n');
    return rows;
  }

  _downloadFile(data: string, name: string, type = 'text/tsv') {
    if (this.dom) {
      const file = new Blob([data], { type: type });
      const link = this.dom.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(file);
        link.setAttribute('href', url);
        link.setAttribute('download', `${name}`);
        link.style.visibility = 'hidden';
        this.dom.body.appendChild(link);
        link.click();
        this.dom.body.removeChild(link);
      }
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
}
