import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ScrollDispatcher } from "@angular/cdk/overlay";
import { ScrollingModule } from "@angular/cdk/scrolling";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, computed,
  DestroyRef, ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges, OnInit,
  Output, QueryList,
  Signal, ViewChildren,
  ViewEncapsulation
} from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router } from '@angular/router';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { FilterCategory } from "@ncats-frontend-library/models/utils";
import { SharedRdasArticleChartsComponent } from "@ncats-frontend-library/shared/rdas/article-charts";
import { ArticleListComponent } from '@ncats-frontend-library/shared/rdas/article-display';
import { ClinicalTrialsListComponent } from '@ncats-frontend-library/shared/rdas/clinical-trials-display';
import { GeneListComponent } from '@ncats-frontend-library/shared/rdas/gene-display';
import { PhenotypeListComponent } from '@ncats-frontend-library/shared/rdas/phenotype-display';
import { ViewportScroller } from '@angular/common';
import { SharedRdasProjectChartsComponent } from "@ncats-frontend-library/shared/rdas/project-charts";
import { ProjectListComponent } from '@ncats-frontend-library/shared/rdas/project-display';
import { SharedRdasTrialsChartsComponent } from "@ncats-frontend-library/shared/rdas/trials-charts";
import { SharedUtilsDataNotFoundComponent } from '@ncats-frontend-library/shared/utils/data-not-found';
import { LoadingSpinnerComponent } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { RdasPanelTemplateComponent } from "@ncats-frontend-library/shared/utils/rdas-panel-template";
import { SharedUtilsScatterPlotComponent } from "@ncats-frontend-library/shared/utils/scatter-plot";

import { DiseaseHeaderComponent } from '../disease-header/disease-header.component';
import { MatCardModule } from '@angular/material/card';

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
    SharedUtilsScatterPlotComponent,
    SharedRdasArticleChartsComponent,
    SharedRdasProjectChartsComponent,
    SharedRdasTrialsChartsComponent,
    MatExpansionModule,
    MatTabsModule,
    ScrollingModule,
    RdasPanelTemplateComponent
  ],
})
export class DiseaseDisplayComponent implements OnInit, AfterViewInit {
  @ViewChildren('scrollSection') scrollSections!: QueryList<ElementRef>;
  @ViewChildren(RdasPanelTemplateComponent) templates!: QueryList<RdasPanelTemplateComponent>;
  private route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  @Input() disease!: Signal<Disease | undefined>;
  @Input() filters!: Signal<FilterCategory[] | undefined>;
  @Input() fragment!: string;
  @Input() offset!: string;
  @Input() id!: string;
  filterMap: Signal<Map<string, FilterCategory[]>> = computed(() => {
    const map = new Map<string, FilterCategory[]>();
    this.filters()!.forEach(filterCat => {
      if(filterCat.parent) {
        let filterCats: FilterCategory[] | undefined = map.get(filterCat.parent);
        if (filterCats) {
          filterCats.push(filterCat);
        } else {
          filterCats = [filterCat]
        }
        map.set(filterCat.parent, filterCats);
      }
      })

    return map;
  })

  @Output() activeElement: EventEmitter<string> = new EventEmitter<string>()
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
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    if (this.route.snapshot.fragment) {
      this.scroller.scrollToAnchor(this.route.snapshot.fragment);

    }

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });

    this.scrollDispatcher.scrolled()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
            let scrollTop: number = this.scroller.getScrollPosition()[1] + 120
            if (this.scroller.getScrollPosition()[1] === 0) {
              this.activeElement.emit('overview');
            } else {
               this.scrollSections.forEach((section) => {
              scrollTop = scrollTop - section.nativeElement?.scrollHeight;
              if (scrollTop >= 0) {
                this.activeElement.emit(section.nativeElement.nextSibling.id);
              }
            })
          }
      });
  }

  ngAfterViewInit(){
    if(this.route.snapshot.queryParamMap.has('offset')) {
      const template: RdasPanelTemplateComponent[] = this.templates
        .filter((template: RdasPanelTemplateComponent) => template._id === this.route.snapshot.fragment)
      template[0].paginator.pageIndex = Number(this.route.snapshot.queryParamMap.get('offset'))/10
    }
  }

/*  ngOnChanges() {
    this.changeRef.detectChanges();
  }*/

  fetchList(
    params: { [key: string]: unknown },
    fragment: string
  ): void {
    this.optionsChange.emit({ params, fragment });
  }
}
