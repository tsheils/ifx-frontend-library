import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ApolloSandbox } from '@apollo/sandbox';

@Component({
  selector: 'ncats-frontend-library-graphql-sandbox',
  template: `
    <div id="embedded-sandbox" #embeddedsandbox></div>
  `,
  styleUrls: ['./graphql-sandbox.component.scss'],
})
export class GraphqlSandboxComponent implements AfterViewInit {
  @ViewChild('embeddedsandbox', {static: true}) embeddedsandbox!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
console.log(this.embeddedsandbox);
    const sandbox = new ApolloSandbox({
      target: this.embeddedsandbox.nativeElement,
      initialEndpoint: 'http://localhost:4000',
      includeCookies: false
    })
  }
}
