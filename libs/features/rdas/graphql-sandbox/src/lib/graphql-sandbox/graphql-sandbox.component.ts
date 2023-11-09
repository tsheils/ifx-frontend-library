import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApolloSandbox } from '@apollo/sandbox';

@Component({
  selector: 'ncats-frontend-library-graphql-sandbox',
  standalone: true,
  imports: [],
  template: `<div id="embedded-sandbox" #embeddedsandbox></div>`,
  styleUrls: ['./graphql-sandbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GraphqlSandboxComponent implements AfterViewInit {
  @ViewChild('embeddedsandbox', { static: true }) embeddedsandbox!: ElementRef;
  isBrowser: boolean;
  url!: string;

  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private changeRef: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.route.data.subscribe((data) => {
        this.url = data['instance'];
        this.changeRef.markForCheck();
        new ApolloSandbox({
          target: this.embeddedsandbox.nativeElement,
          initialEndpoint: this.url,
          includeCookies: false
        });
      });
    }
  }
}
