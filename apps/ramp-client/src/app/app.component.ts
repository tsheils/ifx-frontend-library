import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { LinkTemplateProperty } from '@ncats-frontend-library/models/utils';
import { FooterTemplateComponent } from '@ncats-frontend-library/shared/utils/footer-template';
import { HeaderTemplateComponent } from '@ncats-frontend-library/shared/utils/header-template';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { select, Store } from '@ngrx/store';
import { RampFullBannerComponent } from 'full-banner';
import { NcatsFooterComponent } from 'ncats-footer';
import { NcatsHeaderComponent } from 'ncats-header';

import { map } from 'rxjs';
import { environment } from '../environments/environment';
import { RouterOutlet } from '@angular/router';

import { RampSelectors } from 'ramp-store';

@Component({
  selector: 'ramp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterOutlet,
    NcatsFooterComponent,
    LoadingSpinnerComponent,
    HeaderTemplateComponent,
    RampFullBannerComponent,
    NcatsHeaderComponent,
    FooterTemplateComponent,
  ],
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);
  destroyRef = inject(DestroyRef);

  title = 'ramp-client';
  loading = true;
  isProd = false;
  links: LinkTemplateProperty[] = [
    {
      link: 'about',
      label: 'About',
    },
    {
      link: 'api',
      label: 'API',
      //external: true
    },
  ];

  constructor(
    public dialog: MatDialog,
    private changeRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.isProd = !environment.production;

    this.store
      .pipe(
        select(RampSelectors.getRampLoaded),
        takeUntilDestroyed(this.destroyRef),
        map((res: boolean) => {
          this.loading = !res;
          this.changeRef.markForCheck();
        }),
      )
      .subscribe();
  }
}
