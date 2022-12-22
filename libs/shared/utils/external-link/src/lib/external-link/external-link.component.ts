import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ncats-frontend-library-external-link',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a href="https://www.hhs.gov/web/policies-and-standards/hhs-web-policies/disclaimer/index.html" title="Exit Disclaimer" class="exit-disclaimer">
      <img src="./assets/external-link/exit_disclaimer.png" alt="exit disclaimer icon" class="icon-image">
    </a>
  `,
  styles: [`
    img.icon-image {
      height: 1em;
    }
  `]
})
export class ExternalLinkComponent {}
