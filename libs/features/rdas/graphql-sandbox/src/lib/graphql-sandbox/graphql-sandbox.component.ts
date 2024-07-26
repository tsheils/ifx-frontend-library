import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  InjectionToken,
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
export class GraphqlSandboxComponent {
  @ViewChild('embeddedsandbox', { static: true }) embeddedsandbox!: ElementRef;
  url!: string;

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: InjectionToken<NonNullable<unknown>>,
    private router: Router,
    private route: ActivatedRoute,
    private changeRef: ChangeDetectorRef,
  ) {
    afterNextRender(() => {
      if (isPlatformBrowser(platformId)) {
        this.route.data.subscribe((data) => {
          this.url = data['instance'];
          this.changeRef.markForCheck();
          new ApolloSandbox({
            target: this.embeddedsandbox.nativeElement,
            initialEndpoint: this.url,
          });
        });
      }
    });
  }
}
