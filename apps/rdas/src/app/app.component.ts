import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkScrollableModule, ScrollingModule } from '@angular/cdk/scrolling';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  NavigationExtras,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { LinkTemplateProperty } from '@ncats-frontend-library/models/utils';
import { HeaderTemplateComponent } from '@ncats-frontend-library/shared/utils/header-template';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { MobileHeaderTemplateComponent } from '@ncats-frontend-library/shared/utils/mobile-header-template';
import { SocialSignOnButtonComponent } from '@ncats-frontend-library/shared/utils/social-sign-on';
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
    MatIconModule,
    MatButtonModule,
  ],
})
export class AppComponent {
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  header = viewChild<MobileHeaderTemplateComponent>(
    MobileHeaderTemplateComponent,
  );

  title = 'rdas';
  loaded = false;
  mobile = computed(() => {
    let isMobile = false;
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((breakpointState) => {
        isMobile = breakpointState.matches;
      });
    return isMobile;
  });

  displayLinks = computed(() =>
    this.links.filter(
      (link) => !(link.hideMobile && link.hideMobile === this.mobile()),
    ),
  );
  links: LinkTemplateProperty[] = [
    {
      link: 'diseases',
      label: 'Diseases',
    },
    {
      link: 'about',
      label: 'About',
    },
    {
      link: 'apis',
      label: 'APIs',
      hideMobile: true,
      children: [
        {
          link: 'apis/epi',
          label: 'Epidemiology',
        },
        {
          link: 'apis/history',
          label: 'Natural History',
        },
        {
          link: 'apis/diseases',
          label: 'Diseases',
        },
        {
          link: 'apis/publications',
          label: 'Publications',
        },
        {
          link: 'apis/projects',
          label: 'Projects',
        },
        {
          link: 'apis/trials',
          label: 'Clinical Trials',
        },
      ],
    },
  ];

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

  closeSidenav() {
    if (this.header()) {
      this.header()?.menu.close();
    }
  }
}
