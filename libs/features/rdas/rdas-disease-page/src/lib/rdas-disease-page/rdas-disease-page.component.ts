import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  OnInit,
  Signal,
  ViewEncapsulation
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
import { ActivatedRoute, Router } from "@angular/router";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { FilterCategory } from "@ncats-frontend-library/models/utils";
import { DiseaseDisplayComponent, DiseaseHeaderComponent } from "@ncats-frontend-library/shared/rdas/disease-display";
import { LoadingSpinnerComponent } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { ScrollToTopComponent } from "@ncats-frontend-library/shared/utils/scroll-to-top";
import { DiseaseSelectors } from "@ncats-frontend-library/stores/disease-store";
import { Store } from "@ngrx/store";

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
    LoadingSpinnerComponent,
    ScrollToTopComponent
  ],
})
export class RdasDiseasePageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);

  @Input() disease!: Signal<Disease | undefined>;
  @Input() diseaseFilters!: Signal<FilterCategory[] | undefined>;
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

  constructor(
    private changeRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.disease = this.store.selectSignal(DiseaseSelectors.getSelected);
    this.diseaseFilters = this.store.selectSignal(DiseaseSelectors.getDiseaseFilters);

    if (this.route.snapshot.fragment) {
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

    setUrl(event: {fragment: string, params?: { [key: string]: unknown }}) {
     if(this.route.snapshot.fragment && (this.route.snapshot.fragment === event.fragment)) {
       console.log("yyyyyyy")
       this.router.navigate(['disease'], {
         fragment: event.fragment,
         queryParams: {id: this.id, ...event.params},
         onSameUrlNavigation: "ignore"
       });
     } else {
       console.log("NNNNNNNN")
       this.router.navigate(['disease'], {
         fragment: event.fragment,
         queryParams: {id: this.id, ...event.params}
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
    this.setUrl({fragment: el})
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
