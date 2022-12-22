import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { Subscription } from "@ncats-frontend-library/models/utils";
import { SharedRdasSubscribeButtonModule } from "@ncats-frontend-library/shared/rdas/subscribe-button";
import { DiseaseListCardComponent } from "../disease-list-card/disease-list-card.component";

@Component({
  selector: 'ncats-frontend-library-disease-subscription-list',
  standalone: true,
  imports: [CommonModule, FlexLayoutModule, MatCardModule, MatIconModule, DiseaseListCardComponent, SharedRdasSubscribeButtonModule],
  templateUrl: './disease-subscription-list.component.html',
  styleUrls: ['./disease-subscription-list.component.scss']
})
export class DiseaseSubscriptionListComponent implements OnInit {

  private _subscriptions: Subscription[] = [];
  diseases: Disease[] = [];

  @Input()
  set subscriptions(subscriptions: Subscription[] | undefined) {
    if(subscriptions) {
      this.subscriptions.forEach(sub => {
        this.diseases.push(new Disease({ gard_id: sub.gardID, name: sub.diseaseName }))
      })
      this._subscriptions = subscriptions;
    }
  }

  get subscriptions(): Subscription[] {
    return this._subscriptions;
  }

constructor() {
    console.log("tyryryrt");
}

  ngOnInit(): void {
    console.log(this);
  }

}
