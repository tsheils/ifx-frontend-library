import { isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, ViewChild, ViewEncapsulation } from "@angular/core";
import { ApolloSandbox } from "@apollo/sandbox";

@Component({
  selector: 'ncats-frontend-library-graphql-sandbox',
  template: `
    <div id="embedded-sandbox" #embeddedsandbox></div>
  `,
  styleUrls: ['./graphql-sandbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraphqlSandboxComponent implements AfterViewInit {
  @ViewChild('embeddedsandbox', {static: true}) embeddedsandbox!: ElementRef;
  isBrowser: boolean;

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor( @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
if(this.isBrowser) {
  const sandbox = new ApolloSandbox({
    target: this.embeddedsandbox.nativeElement,
    initialEndpoint: 'http://localhost:4000',
    includeCookies: false,
  })
}
  }
}
