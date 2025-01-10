import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ncats-frontend-library-external-link',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      href="https://www.hhs.gov/web/policies-and-standards/hhs-web-policies/disclaimer/index.html"
      target="_blank"
      rel="noreferrer"
      title="Exit Disclaimer"
      class="exit-disclaimer"
    >
      <mat-icon class="exit-disclaimer">open_in_new</mat-icon>
    </a>
  `,
  standalone: true,
  styles: [
    `
      .exit-disclaimer {
        padding: 0;
        font-size: 1rem;
      }
    `,
  ],
})
export class ExternalLinkComponent {}
