import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { SubscribeButtonComponent } from '@ncats-frontend-library/shared/rdas/subscribe-button';

@Component({
  selector: 'ncats-frontend-library-shared-utils-data-not-found',
  standalone: true,
  imports: [CommonModule, SubscribeButtonComponent, MatButton],
  templateUrl: './shared-utils-data-not-found.component.html',
  styleUrls: ['./shared-utils-data-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SharedUtilsDataNotFoundComponent {
  message = input<string>();
  subscribed = false;

  setSub(sub: boolean) {
    this.subscribed = sub;
  }
}
