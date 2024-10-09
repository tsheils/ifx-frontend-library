import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ScrollDispatcher, ScrollingModule } from '@angular/cdk/scrolling';
import {
  CommonModule,
  NgOptimizedImage,
  ViewportScroller,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { FilterCategory } from '@ncats-frontend-library/models/utils';
import {
  DiseaseDisplayComponent,
  DiseaseHeaderComponent,
} from '@ncats-frontend-library/shared/rdas/disease-display';
import { GeneListComponent } from '@ncats-frontend-library/shared/rdas/gene-display';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { ScrollToTopComponent } from '@ncats-frontend-library/shared/utils/scroll-to-top';
import {
  DiseaseSelectors,
  FetchDiseaseActions,
} from '@ncats-frontend-library/stores/disease-store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ncats-frontend-library-rdas-disease-page',
  templateUrl: './rdas-disease-page.component.html',
  styleUrls: ['./rdas-disease-page.component.scss'],
  standalone: true,
  animations: [
    trigger('followOnScroll', [
      state('in', style({ top: '30vh' })),
      state(
        'out',
        style({
          top: '15vh',
        }),
      ),
      transition('in => out', [group([animate('200ms ease-out')])]),
      transition('out => in', [group([animate('200ms ease-in')])]),
    ]),
  ],
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
    LoadingSpinnerComponent,
    ScrollToTopComponent,
    NgOptimizedImage,
    ScrollingModule,
    GeneListComponent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdasDiseasePageComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  scroller = inject(ViewportScroller);
  scrollDispatcher = inject(ScrollDispatcher);
  private changeRef = inject(ChangeDetectorRef);
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  destroyRef = inject(DestroyRef);

  disease: Signal<Disease | undefined> = this.store.selectSignal(
    DiseaseSelectors.getSelected,
  );
  loaded: Signal<boolean | undefined> = this.store.selectSignal(
    DiseaseSelectors.getDiseasesLoaded,
  );
  diseaseFilters: Signal<FilterCategory[] | undefined> =
    this.store.selectSignal(DiseaseSelectors.getDiseaseFilters);
  staticDiseaseFilters: Signal<FilterCategory[] | undefined> =
    this.store.selectSignal(DiseaseSelectors.getStaticDiseaseFilters);

  animationState = signal('in');

  /**
   * default active element for menu highlighting, will be replaced on scroll
   * @type {string}
   */
  activeElement = 'overview';
  mobile = false;

  ngOnInit(): void {
    this.scrollDispatcher.scrolled().subscribe(() => {
      this.animationState.set(
        this.scroller.getScrollPosition()[1] > 120 ? 'out' : 'in',
      );
    });

    if (this.route.snapshot && this.route.snapshot.fragment) {
      this.activeElement = this.route.snapshot.fragment;
    }

    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });
  }

  setUrl(event: { fragment: string; params?: { [key: string]: unknown } }) {
    if (
      this.route.snapshot.fragment &&
      this.route.snapshot.fragment === event.fragment
    ) {
      const oldParams: { [key: string]: unknown } = {};
      Object.keys(this.route.snapshot.queryParams).forEach((key) => {
        if (key != 'offset') {
          oldParams[key] = this.route.snapshot.queryParams[key];
        }
      });
      this.router.navigate(['disease'], {
        fragment: event.fragment,
        queryParams: { ...oldParams, ...event.params },
        onSameUrlNavigation: 'ignore',
      });
    } else {
      this.router.navigate(['disease'], {
        fragment: event.fragment,
        queryParams: { id: this.disease()?.gardId, ...event.params },
      });
    }
  }

  setActiveElement(event: string) {
    this.activeElement = event;
  }
  /**
   * scroll to section
   * @param el
   */
  public scroll(el: string): void {
    this.setUrl({ fragment: el });
  }

  /**
   * check which section is active
   * @param {string} check
   * @returns {boolean}
   */
  isActive(check: string): boolean {
    return this.activeElement === check;
  }

  ngOnDestroy() {
    this.store.dispatch(FetchDiseaseActions.clearStaticDiseaseFilters());
    // this.store.dispatch(FetchDiseaseActions.clearDisease());
  }
}
