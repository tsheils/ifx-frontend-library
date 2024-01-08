import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribeButtonComponent } from '@ncats-frontend-library/shared/rdas/subscribe-button';

@Component({
  selector: 'ncats-frontend-library-shared-utils-data-not-found',
  standalone: true,
  imports: [CommonModule, SubscribeButtonComponent],
  templateUrl: './shared-utils-data-not-found.component.html',
  styleUrls: ['./shared-utils-data-not-found.component.scss'],
})
export class SharedUtilsDataNotFoundComponent {
  @Input() message?: string;
  subscribed = false;

  setSub(sub: boolean) {
    this.subscribed = sub;
  }
}
