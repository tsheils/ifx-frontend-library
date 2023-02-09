import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'ncats-frontend-library-external-link',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <a href="https://www.hhs.gov/web/policies-and-standards/hhs-web-policies/disclaimer/index.html" title="Exit Disclaimer" class="exit-disclaimer">
     <mat-icon class="exit-disclaimer">open_in_new</mat-icon>
<!--
      <img src="./assets/external-link/exit_disclaimer.png" alt="exit disclaimer icon" class="icon-image">
-->
    </a>
  `,
  styles: [`
    img.icon-image {
      height: 1em;
    }

    .exit-disclaimer {
      color: #ffffff;
    }
  `]
})
export class ExternalLinkComponent {}
