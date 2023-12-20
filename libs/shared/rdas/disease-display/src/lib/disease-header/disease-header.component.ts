import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Input,
  Signal,
  ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { SubscribeButtonComponent } from '@ncats-frontend-library/shared/rdas/subscribe-button';

@Component({
  selector: 'ncats-frontend-library-disease-header',
  templateUrl: './disease-header.component.html',
  styleUrls: ['./disease-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatIconModule, SubscribeButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiseaseHeaderComponent {
  @Input() disease!: Signal<Disease | undefined>;
 // title = computed(() => `${this.disease()?.name}: ${this.disease()?.gardId}`);
  parsedId = computed(() => this.getID());

  getID() {
    let ret = 0;
    if (this.disease()) {
      const gardId: string | undefined = this.disease()?.gardId;
      if (gardId) {
        const split = gardId.split('GARD:')[1];
        ret = parseInt(split);
      }
    }
    return ret;
  }
}
