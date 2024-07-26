import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ViewportScroller } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  Signal,
  SimpleChange,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { FilterCategory } from '@ncats-frontend-library/models/utils';
import { ArticleListComponent } from '@ncats-frontend-library/shared/rdas/article-display';
import { ClinicalTrialsListComponent } from '@ncats-frontend-library/shared/rdas/clinical-trials-display';
import { GeneListComponent } from '@ncats-frontend-library/shared/rdas/gene-display';
import { PhenotypeListComponent } from '@ncats-frontend-library/shared/rdas/phenotype-display';
import { ProjectListComponent } from '@ncats-frontend-library/shared/rdas/project-display';
import { ChartWrapperComponent } from '@ncats-frontend-library/shared/utils/chart-wrapper';
import { SharedUtilsDataNotFoundComponent } from '@ncats-frontend-library/shared/utils/data-not-found';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { RdasPanelTemplateComponent } from '@ncats-frontend-library/shared/utils/rdas-panel-template';
import { DiseaseHeaderComponent } from '../disease-header/disease-header.component';

@Component({
  selector: 'ncats-frontend-library-disease-display',
  templateUrl: './disease-display.component.html',
  styleUrls: ['./disease-display.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatCardModule,
    DiseaseHeaderComponent,
    ArticleListComponent,
    ProjectListComponent,
    ClinicalTrialsListComponent,
    GeneListComponent,
    PhenotypeListComponent,
    SharedUtilsDataNotFoundComponent,
    LoadingSpinnerComponent,
    MatExpansionModule,
    MatTabsModule,
    ScrollingModule,
    RdasPanelTemplateComponent,
    ChartWrapperComponent,
  ],
})
export class DiseaseDisplayComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @ViewChildren('scrollSection') scrollSections!: QueryList<ElementRef>;
  @ViewChildren(RdasPanelTemplateComponent)
  templates!: QueryList<RdasPanelTemplateComponent>;
  private route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  disease = input<Disease>();
  loaded = input<boolean | undefined>();
  filters = input<FilterCategory[]>();
  staticFilters = input<FilterCategory[]>();
  fragment = input<string>();
  offset = input<string>();
  id = input<string>();

  staticFilterMap: Signal<Map<string, FilterCategory[]>> = computed(() => {
    return this.setFilterMap(this.staticFilters());
  });
  filterMap: Signal<Map<string, FilterCategory[]>> = computed(() => {
    return this.setFilterMap(this.filters());
  });

  @Output() activeElement: EventEmitter<string> = new EventEmitter<string>();
  @Output() optionsChange: EventEmitter<{
    params: { [key: string]: unknown };
    fragment: string;
  }> = new EventEmitter<{
    params: { [key: string]: unknown };
    fragment: string;
  }>();

  mobile = false;

  constructor(
    private changeRef: ChangeDetectorRef,
    private router: Router,
    public scroller: ViewportScroller,
    private scrollDispatcher: ScrollDispatcher,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit() {
    this.scroller.setOffset([0, 250]);
    if (this.route.snapshot && this.route.snapshot.fragment) {
      this.scroller.scrollToAnchor(this.route.snapshot.fragment);
    }

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });

    this.scrollDispatcher
      .scrolled()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        let scrollTop: number = this.scroller.getScrollPosition()[1] + 120;
        if (this.scroller.getScrollPosition()[1] === 0) {
          this.activeElement.emit('overview');
        } else {
          this.scrollSections.forEach((section) => {
            scrollTop = scrollTop - section.nativeElement?.scrollHeight;
            if (scrollTop >= 0 && section.nativeElement.nextSibling) {
              this.activeElement.emit(section.nativeElement.nextSibling.id);
            }
          });
        }
      });
  }

  ngOnChanges(change: { disease: SimpleChange }) {
    if (change['disease'] && !change['disease'].firstChange) {
      this.setPage();
    }
  }

  ngAfterViewInit() {
    this.setPage();
  }

  fetchList(params: { [key: string]: unknown }, fragment: string): void {
    this.optionsChange.emit({ params, fragment });
  }

  setPage() {
    const template: RdasPanelTemplateComponent[] = this.templates.filter(
      (template: RdasPanelTemplateComponent) =>
        template._id() === this.route?.snapshot?.fragment,
    );
    if (template && template.length) {
      if (
        this.route.snapshot &&
        this.route.snapshot.queryParamMap.has('offset')
      ) {
        template[0].paginator.pageIndex =
          Number(this.route.snapshot.queryParamMap.get('offset')) / 10;
      } else {
        template[0].paginator.pageIndex = 0;
      }
    }
  }

  setFilterMap(filtersL: FilterCategory[] | undefined) {
    const map = new Map<string, FilterCategory[]>();
    if (filtersL && filtersL.length) {
      filtersL.forEach((filterCat) => {
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
  }
}
