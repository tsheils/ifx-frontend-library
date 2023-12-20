import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ScrollDispatcher } from "@angular/cdk/overlay";
import { CommonModule, ViewportScroller } from "@angular/common";
import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  computed,
  ContentChildren, DestroyRef, ElementRef,
  HostListener, inject,
  Input,
  OnInit,
  QueryList,
  Signal, ViewChild,
  ViewChildren, ViewEncapsulation
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute } from '@angular/router';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { FilterCategory } from "@ncats-frontend-library/models/utils";
import { DiseaseDisplayComponent, DiseaseHeaderComponent } from "@ncats-frontend-library/shared/rdas/disease-display";
import { ScrollToTopComponent } from '@ncats-frontend-library/shared/utils/scroll-to-top';
import {
  DiseasesFacade,
  fetchDisease,
} from '@ncats-frontend-library/stores/disease-store';
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'ncats-frontend-library-rdas-disease-page',
  templateUrl: './rdas-disease-page.component.html',
  styleUrls: ['./rdas-disease-page.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    DiseaseDisplayComponent,
    DiseaseHeaderComponent,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    ScrollToTopComponent],
})
export class RdasDiseasePageComponent implements OnInit {
  @Input() disease!: Signal<Disease | undefined>;
  @Input() diseaseFilters!: Signal<FilterCategory[] | undefined>;
  @ViewChild(DiseaseDisplayComponent) diseaseDisplayComponent!: DiseaseDisplayComponent;
  @Input() offset!: string;
  @Input() id!: string;
  /**
   * default active element for menu highlighting, will be replaced on scroll
   * @type {string}
   */
  activeElement = 'overview';

  destroyRef = inject(DestroyRef);

  mobile = false;

  loaded = computed(
    () => this.disease()?.gardId === this.id
  );

  options = {
    gardId: '',
    source: 'article',
    options: {},
  };

  constructor(
    private diseaseFacade: DiseasesFacade,
    private changeRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private scrollDispatcher: ScrollDispatcher,
    private scroller: ViewportScroller
  ) {

  }

  ngOnInit(): void {
    console.log(this)
    this.disease = this.diseaseFacade.selectedDiseases$;
    this.diseaseFilters = this.diseaseFacade.diseaseFilters$;

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });
  }

  fetchDisease(disease: Disease) {
    this.options.gardId = disease.gardId;
    this.options.options = {
      mentionedInArticlesOptions: {
        limit: 10,
        offset: 0,
        sort: [
          {
            firstPublicationDate: 'DESC',
          },
        ],
      },
    };
   // this.diseaseFacade.dispatch(fetchDisease(this.options));
  }

  fetchDiseaseInfo(options: {
    variables: { [key: string]: unknown };
    origin: string;
  }) {
    this.options.options = options.variables;
    this.options.source = options.origin;
  //  this.diseaseFacade.dispatch(loadDisease$(this.options));
  }

  setActiveElement(event: string) {
    this.activeElement = event;
  }
  /**
   * scroll to section
   * @param el
   */
  public scroll(el: string): void {
    //  el.scrollIntoView(true);
    this.diseaseDisplayComponent.setUrl(el)
  }

  /**
   * check which section is active
   * @param {string} check
   * @returns {boolean}
   */
  isActive(check: string): boolean {
    return this.activeElement === check;
  }

}
