import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { LinkTemplateProperty } from '@ncats-frontend-library/models/utils';
import { FooterTemplateComponent } from '@ncats-frontend-library/shared/utils/footer-template';
import { HeaderTemplateComponent } from '@ncats-frontend-library/shared/utils/header-template';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { Store } from '@ngrx/store';
import { RampFullBannerComponent } from 'full-banner';

import { environment } from '../environments/environment';
import { RouterOutlet } from '@angular/router';

import { RampSelectors } from 'ramp-store';

@Component({
  selector: 'ramp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    LoadingSpinnerComponent,
    HeaderTemplateComponent,
    RampFullBannerComponent,
    FooterTemplateComponent,
  ],
  standalone: true,
})
export class AppComponent {
  private readonly store = inject(Store);
  loading = this.store.selectSignal(RampSelectors.getRampLoaded);
  isProd = computed(() => !environment.production);
  title = 'ramp-client';
  links: LinkTemplateProperty[] = [
    {
      link: 'analyze',
      label: 'Analyze',
    },
    {
      link: 'about',
      label: 'About',
    },
    {
      link: 'api',
      label: 'API',
    },
  ];
}
