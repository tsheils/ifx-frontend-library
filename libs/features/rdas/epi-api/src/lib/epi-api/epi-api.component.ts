import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  InjectionToken,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import SwaggerUI from 'swagger-ui';

@Component({
    selector: 'ncats-frontend-library-epi-api',
    imports: [CommonModule],
    templateUrl: './epi-api.component.html',
    styleUrls: ['./epi-api.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EpiApiComponent {
  /**
   * container that holds the swagger ui
   */
  @ViewChild('documentation') el!: ElementRef;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: InjectionToken<NonNullable<unknown>>,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    /**
     * create swagger ui viewer
     */
    afterNextRender(() => {
      if (this.isBrowser) {
        SwaggerUI({
          url: '/assets/epi-api/epi4rdas.json',
          domNode: this.el.nativeElement,
        });
      }
    });
  }
}
