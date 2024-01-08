import { Component, Input, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { Subscription } from '@ncats-frontend-library/models/utils';

import { Subject } from 'rxjs';
import { DiseaseListCardComponent } from '../disease-list-card/disease-list-card.component';

@Component({
  selector: 'ncats-frontend-library-disease-subscription-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    DiseaseListCardComponent,
  ],
  templateUrl: './disease-subscription-list.component.html',
  styleUrls: ['./disease-subscription-list.component.scss'],
})
export class DiseaseSubscriptionListComponent {
  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<boolean> = new Subject();

  private _subscriptions: Subscription[] = [];
  diseases!: Signal<Disease[] | undefined>;

  @Input()
  set subscriptions(subscriptions: Subscription[] | undefined) {
    if (subscriptions) {
      const diseaseArr: Disease[] = [];
      subscriptions.forEach((sub) => {
        diseaseArr.push(
          new Disease({ gardId: sub.gardID, name: sub.diseaseName })
        );
        this.diseases = signal<Disease[]>(diseaseArr);
      });
      this._subscriptions = subscriptions;
    }
  }

  get subscriptions(): Subscription[] {
    return this._subscriptions;
  }
}
