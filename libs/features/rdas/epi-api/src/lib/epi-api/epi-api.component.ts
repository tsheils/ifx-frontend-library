import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import SwaggerUI from 'swagger-ui';

@Component({
  selector: 'ncats-frontend-library-epi-api',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './epi-api.component.html',
  styleUrls: ['./epi-api.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EpiApiComponent {
  /**
   * container that holds the swagger ui
   */
  @ViewChild('documentation') el!: ElementRef;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * create swagger ui viewer
   */
  ngAfterViewInit() {
    if (this.isBrowser) {
      SwaggerUI({
        url: '/assets/epi-api/epi4rdas.json',
        domNode: this.el.nativeElement,
      });
    }
  }
}
