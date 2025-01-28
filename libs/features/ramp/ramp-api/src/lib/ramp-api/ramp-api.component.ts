import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core'
import SwaggerUI from 'swagger-ui'

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
  @ViewChild('documentation') el!: ElementRef

  isBrowser: boolean
  url = '/assets/data/ramp-api.json'

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId)
  }
  ngAfterViewInit() {
    if (this.isBrowser) {
      SwaggerUI({
        url: this.url,
        domNode: this.el.nativeElement,
      })
    }
  }
}
