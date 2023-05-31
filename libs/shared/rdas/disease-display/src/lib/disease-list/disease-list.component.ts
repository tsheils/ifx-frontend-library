import { Component, Input } from "@angular/core";
import { Disease } from "@ncats-frontend-library/models/rdas";
import { DiseaseListCardComponent } from "../disease-list-card/disease-list-card.component";
import { NgFor } from "@angular/common";

@Component({
    selector: 'ncats-frontend-library-disease-list',
    templateUrl: './disease-list.component.html',
    styleUrls: ['./disease-list.component.scss'],
    standalone: true,
    imports: [NgFor, DiseaseListCardComponent]
})
export class DiseaseListComponent {
  @Input() diseases!: Disease[];
  @Input() loading = true;
}
