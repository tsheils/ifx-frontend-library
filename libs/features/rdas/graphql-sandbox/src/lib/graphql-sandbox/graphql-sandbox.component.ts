import { ScrollDispatcher } from '@angular/cdk/overlay';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Inject,
  InjectionToken,
  PLATFORM_ID,
  viewChild,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApolloSandbox } from '@apollo/sandbox';

@Component({
  selector: 'ncats-frontend-library-graphql-sandbox',
  imports: [],
  template: ` <div id="embedded-sandbox" #embeddedsandbox></div>`,
  styleUrls: ['./graphql-sandbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class GraphqlSandboxComponent {
  platformId: InjectionToken<NonNullable<unknown>> = inject(
    PLATFORM_ID
  ) as InjectionToken<NonNullable<unknown>>;
  isBrowser = computed(() => isPlatformBrowser(this.platformId));
  destroyRef = inject(DestroyRef);
  private changeRef = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  embeddedsandbox = viewChild<ElementRef>('embeddedsandbox');
  url!: string;

  constructor() {
    afterNextRender(() => {
      if (this.isBrowser()) {
        this.route.data.subscribe((data) => {
          this.url = data['instance'];
          this.changeRef.markForCheck();
          new ApolloSandbox({
            target: this.embeddedsandbox()?.nativeElement,
            initialEndpoint: this.url,
          });
        });
      }
    });
  }
}
