import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayModule, ScrollDispatcher } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  DataProperty,
  UpsetData,
  UpsetPlot,
} from '@ncats-frontend-library/models/utils';
import { Store } from '@ngrx/store';
import { NcatsDatatableComponent } from 'ncats-datatable';
import { EntityCount } from 'ramp';
import { RampSelectors } from 'ramp-store';
import { CdkScrollable, ScrollingModule } from '@angular/cdk/scrolling';
import { NgClass, ViewportScroller } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { UpsetComponent } from 'upset-chart';

@Component({
  selector: 'ramp-about',
  templateUrl: './ramp-about.component.html',
  styleUrls: ['./ramp-about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatListModule,
    NgClass,
    CdkScrollable,
    NcatsDatatableComponent,
    UpsetComponent,
    ScrollingModule,
    OverlayModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
  ],
})
export class AboutComponent implements OnInit {
  private readonly store = inject(Store);
  destroyRef = inject(DestroyRef);

  @ViewChildren('scrollSection') scrollSections!: QueryList<ElementRef>;
  mobile = signal(false);

  /**
   * default active element for menu highlighting, will be replaced on scroll
   * @type {string}
   */
  activeElement = signal('about');

  allRamp = this.store.selectSignal(RampSelectors.getAllRamp);

  genesData = computed(() => {
    if (this.allRamp() && this.allRamp().geneIntersects) {
      const upset = new UpsetPlot(
        this.allRamp()!.geneIntersects!.map((g) => new UpsetData(g)),
      );
      return upset;
    } else return {} as UpsetPlot;
  });
  compoundsData = computed(() => {
    if (this.allRamp() && this.allRamp().metaboliteIntersects) {
      return new UpsetPlot(
        this.allRamp()!.metaboliteIntersects!.map((g) => new UpsetData(g)),
      );
    } else return {} as UpsetPlot;
  });

  sourceVersions = computed(() => this.allRamp().sourceVersions);
  entityCounts = computed(() =>
    this.allRamp()!.entityCounts!.map((count: EntityCount) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(count).map((value: string[]) => {
        newObj[<string>value[0]] = new DataProperty({
          label: <string>value[0],
          value: <string>value[1],
        });
      });
      return newObj;
    }),
  );

  entityCountsColumns: DataProperty[] = [
    new DataProperty({
      label: 'Category',
      field: 'status_category',
      sortable: true,
      sorted: 'asc',
    }),
    new DataProperty({
      label: 'ChEBI',
      field: 'chebi',
      sortable: true,
    }),
    new DataProperty({
      label: 'HMDB',
      field: 'hmdb',
      sortable: true,
    }),
    new DataProperty({
      label: 'KEGG',
      field: 'kegg',
      sortable: true,
    }),
    new DataProperty({
      label: 'LIPIDMAPS',
      field: 'lipidmaps',
      sortable: true,
    }),
    new DataProperty({
      label: 'Reactome',
      field: 'reactome',
      sortable: true,
    }),
    new DataProperty({
      label: 'WikiPathways',
      field: 'wiki',
      sortable: true,
    }),
  ];
  dbVersion = computed(() => this.sourceVersions()![0]?.ramp_db_version);

  dbUpdated = computed(() => this.sourceVersions()![0]?.db_mod_date);

  constructor(
    private changeRef: ChangeDetectorRef,
    private scrollDispatcher: ScrollDispatcher,
    public scroller: ViewportScroller,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile.set(result.matches);
      });

    this.scrollDispatcher
      .scrolled()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        let scrollTop: number = this.scroller.getScrollPosition()[1];
        if (scrollTop === 0) {
          this.activeElement.set('about');
        } else {
          this.scrollSections.forEach((section) => {
            scrollTop = scrollTop - section.nativeElement?.scrollHeight;
            if (scrollTop >= 0) {
              this.activeElement.set(section.nativeElement.nextSibling.id);
            }
          });
        }
      });
  }

  /**
   * scroll to section
   * @param el
   */
  public scroll(el: HTMLElement): void {
    //  el.scrollIntoView(true);
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
    this.activeElement.set(el.id);
  }

  /**
   * check which section is active
   * @param {string} check
   * @returns {boolean}
   */
  isActive(check: string): boolean {
    return this.activeElement() === check;
  }
}
