import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { SubscribeButtonComponent } from "../../../../subscribe-button/src/lib/subscribe-button/subscribe-button.component";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'ncats-frontend-library-disease-header',
    templateUrl: './disease-header.component.html',
    styleUrls: ['./disease-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatIconModule, SubscribeButtonComponent]
})
export class DiseaseHeaderComponent implements OnInit {
  @Input()
  disease!: Disease;
  trimmed_id!: number;

  ngOnInit(): void {
    this.trimmed_id = +this.disease.gardId.split('GARD:')[1];
  }

}
