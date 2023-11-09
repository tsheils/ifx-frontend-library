import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  Output,
  Signal,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { ArticleListComponent } from '@ncats-frontend-library/shared/rdas/article-display';
import { ClinicalTrialsListComponent } from '@ncats-frontend-library/shared/rdas/clinical-trials-display';
import { GeneListComponent } from '@ncats-frontend-library/shared/rdas/gene-display';
import { PhenotypeListComponent } from '@ncats-frontend-library/shared/rdas/phenotype-display';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { NgIf, ViewportScroller } from "@angular/common";
import { ProjectListComponent } from '@ncats-frontend-library/shared/rdas/project-display';
import { SharedUtilsDataNotFoundComponent } from '@ncats-frontend-library/shared/utils/data-not-found';
import { BehaviorSubject } from 'rxjs';
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
    NgIf,
    MatTabsModule,
    ArticleListComponent,
    ProjectListComponent,
    ClinicalTrialsListComponent,
    GeneListComponent,
    PhenotypeListComponent,
    SharedUtilsDataNotFoundComponent,
  ],
})
export class DiseaseDisplayComponent implements OnChanges {
  destroyRef = inject(DestroyRef);
  @Input() disease!: Signal<Disease | undefined>;

  @Output() optionsChange: EventEmitter<{
    variables: { [key: string]: string | number | undefined };
    origin: string;
  }> = new EventEmitter<{
    variables: { [key: string]: string | number | undefined };
    origin: string;
  }>();

  tabs = ['epiArticles', 'nonEpiArticles', 'project', 'trials'];
  selectedIndex = 0;
  mobile = false;

  constructor(
    private changeRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private scroller: ViewportScroller,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    if (this.route.snapshot.fragment) {
      this.selectedIndex = this.tabs.indexOf(this.route.snapshot.fragment);
      this.scroller.scrollToAnchor('disease-tabs');
    }
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });
  }

  ngOnChanges(change: SimpleChanges) {
    this.changeRef.detectChanges();
  }

  pageList(
    variables: { [key: string]: string | number | undefined },
    pageField: string,
    origin: string
  ): void {
    this.setUrl(origin, variables['offset']);
    this.optionsChange.emit({ variables, origin });
  }

  setTabUrl(tab: MatTabChangeEvent) {
    this.setUrl(this.tabs[tab.index]);
  }

  setUrl(tab: string, page?: number | string | undefined) {
    this.router.navigate(['disease'], {
      fragment: tab,
      queryParams: { offset: page },
      queryParamsHandling: 'merge',
    });
  }
}
