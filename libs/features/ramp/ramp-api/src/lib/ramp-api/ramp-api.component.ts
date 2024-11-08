import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import SwaggerUI from 'swagger-ui';

@Component({
  selector: 'ramp-ramp-api',
  templateUrl: './ramp-api.component.html',
  styleUrls: ['./ramp-api.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class RampApiComponent implements AfterViewInit {
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
        //url: '/assets/ramp-api/data/ramp_openapi_with_extensions.yml',
        url: '/assets/data/ramp-api.json',
        domNode: this.el.nativeElement,
      });
    }
  }
}
