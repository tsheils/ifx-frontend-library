import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { CdkScrollableModule, ScrollingModule } from '@angular/cdk/scrolling';
import { DOCUMENT, isPlatformBrowser, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Inject,
  inject,
  InjectionToken,
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
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import {
  LinkTemplateProperty,
  User,
} from '@ncats-frontend-library/models/utils';
import { RdasSearchComponent } from '@ncats-frontend-library/shared/rdas/rdas-search';
import { SharedUtilsFileUploadComponent } from '@ncats-frontend-library/shared/utils/file-upload';
import { FooterTemplateComponent } from '@ncats-frontend-library/shared/utils/footer-template';
import { HeaderTemplateComponent } from '@ncats-frontend-library/shared/utils/header-template';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { MobileHeaderTemplateComponent } from '@ncats-frontend-library/shared/utils/mobile-header-template';
import { SocialSignOnButtonComponent } from '@ncats-frontend-library/shared/utils/social-sign-on';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
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
    SharedUtilsFileUploadComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(CdkScrollable, { static: false }) scrollable!: CdkScrollable;
  /**
   * reference to header oject. used to change display options
   */
  @ViewChild(MobileHeaderTemplateComponent, { static: false })
  header!: MobileHeaderTemplateComponent;
  destroyRef = inject(DestroyRef);

  title = 'adme-loader';
  loaded = false;
  user?: User;
  mobile = false;
  activeLink!: string;

  links: LinkTemplateProperty[] = [
    {
      link: 'adme',
      label: 'ADME',
    },
    {
      link: 'about',
      label: 'ABOUT',
    },
  ];

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: InjectionToken<NonNullable<unknown>>,
    @Inject(DOCUMENT) private document: Document,
    private scrollDispatcher: ScrollDispatcher,
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.mobile = result.matches;
        this.changeRef.markForCheck();
      });

    /**
     * This shows loading spinner for page navigation - usually navigation is finished before the page is finished loading
     */
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e: Event) => {
        if (e instanceof NavigationEnd) {
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
          console.log('adme');
        }
        this.changeRef.detectChanges();
      });
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
