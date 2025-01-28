import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core'
import { SubscribeButtonComponent } from '@ncats-frontend-library/shared/rdas/subscribe-button'

@Component({
  selector: 'ncats-frontend-library-shared-utils-data-not-found',
  imports: [CommonModule, SubscribeButtonComponent],
  templateUrl: './shared-utils-data-not-found.component.html',
  styleUrls: ['./shared-utils-data-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class SharedUtilsDataNotFoundComponent {
  message = input<string>()
  subscribed = false

  setSub(sub: boolean) {
    this.subscribed = sub
  }
}
