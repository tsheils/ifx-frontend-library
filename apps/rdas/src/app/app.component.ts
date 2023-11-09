import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { CdkScrollableModule, ScrollingModule } from '@angular/cdk/scrolling';
import { DOCUMENT, isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  inject,
  Inject,
  InjectionToken,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  Event,
  NavigationEnd,
  NavigationExtras,
  NavigationStart,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Disease } from '@ncats-frontend-library/models/rdas';
import {
  LinkTemplateProperty,
  User,
} from '@ncats-frontend-library/models/utils';
import { HeaderTemplateComponent } from '@ncats-frontend-library/shared/utils/header-template';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { MobileHeaderTemplateComponent } from '@ncats-frontend-library/shared/utils/mobile-header-template';
import { SocialSignOnButtonComponent } from '@ncats-frontend-library/shared/utils/social-sign-on';
import { DiseasesFacade } from '@ncats-frontend-library/stores/disease-store';
import { UsersFacade } from '@ncats-frontend-library/stores/user-store';
import { FooterTemplateComponent } from '@ncats-frontend-library/shared/utils/footer-template';
import { RdasSearchComponent } from '@ncats-frontend-library/shared/rdas/rdas-search';

@Component({
  selector: 'ncats-frontend-library-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    NgClass,
    MatSidenavModule,
    RdasSearchComponent,
    RouterOutlet,
    FooterTemplateComponent,
    HeaderTemplateComponent,
    SocialSignOnButtonComponent,
    CdkScrollableModule,
    ScrollingModule,
    LoadingSpinnerComponent,
    MobileHeaderTemplateComponent,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild(CdkScrollable, { static: false }) scrollable!: CdkScrollable;
  /**
   * reference to header oject. used to change display options
   */
  @ViewChild(MobileHeaderTemplateComponent, { static: false })
  header!: MobileHeaderTemplateComponent;
  destroyRef = inject(DestroyRef);

  title = 'rdas';
  loaded = false;
  hideSearch = false;
  user?: User;
  mobile = false;
  activeLink!: string;

  links: LinkTemplateProperty[] = [
    {
      link: 'diseases',
      label: 'DISEASES',
    },
    {
      link: 'about',
      label: 'ABOUT',
    },
    {
      link: 'apis',
      label: 'APIs',
      children: [
        {
          link: 'apis/epi',
          label: 'EPIDEMIOLOGY',
        },
        {
          link: 'apis/diseases',
          label: 'DISEASES',
        },
        {
          link: 'apis/publications',
          label: 'PUBLICATIONS',
        },
        {
          link: 'apis/projects',
          label: 'PROJECTS',
        },
        {
          link: 'apis/trials',
          label: 'TRIALS',
        },
      ],
    },
  ];

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // this.setMobile();
  }

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: InjectionToken<NonNullable<unknown>>,
    @Inject(DOCUMENT) private document: Document,
    private scrollDispatcher: ScrollDispatcher,
    private router: Router,
    private userFacade: UsersFacade,
    private diseaseFacade: DiseasesFacade,
    private changeRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });

    this.userFacade.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res) {
          this.user = res[0];
        }
      });

    /**
     * This shows loading spinner for page navigation - usually navigation is finished before the page is finished loading
     */
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e: Event) => {
        if (e instanceof NavigationEnd) {
          this.hideSearch = e.url.split('/diseases').length > 1;
          this.loaded = true;
          this.activeLink = this.router.url.split('/')[1];
          this.closeSidenav();
        }
      });

    this.scrollDispatcher
      .scrolled()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (isPlatformBrowser(this.platformId) && this.document) {
          if (this.router.url.includes('diseases')) {
            if (
              this.scrollable.getElementRef().nativeElement.offsetTop > 100 ||
              this.document.documentElement.scrollTop > 100 ||
              this.document.body.scrollTop > 100
            ) {
              this.hideSearch = false;
            } else if (
              (!this.hideSearch &&
                this.scrollable.getElementRef().nativeElement.offsetTop < 10) ||
              this.document.documentElement.scrollTop < 10 ||
              this.document.body.scrollTop < 10
            ) {
              this.hideSearch = true;
            }
          }
        }
        this.changeRef.detectChanges();
      });
  }

  selectDisease(event: Disease): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: event.gardId,
      },
    };
    this.router.navigate(['/disease'], navigationExtras);
  }

  /**
   * close sidenav for header menu
   */
  closeSidenav() {
    if (this.header) {
      this.header.menu.close();
    }
  }
}
