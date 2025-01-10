import {
  afterNextRender,
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
  selector: 'lib-history-api',
  imports: [CommonModule],
  templateUrl: './history-api.component.html',
  styleUrl: './history-api.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class HistoryApiComponent {
  @ViewChild('documentation') el!: ElementRef;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: InjectionToken<NonNullable<unknown>>,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    afterNextRender(() => {
      if (this.isBrowser) {
        SwaggerUI({
          url: '/assets/history-api/nhs_swagger.json',
          domNode: this.el.nativeElement,
        });
      }
    });
  }
}
