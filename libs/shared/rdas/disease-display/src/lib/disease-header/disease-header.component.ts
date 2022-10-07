import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Disease } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-disease-header',
  templateUrl: './disease-header.component.html',
  styleUrls: ['./disease-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiseaseHeaderComponent implements OnInit {
  @Input()
  disease!: Disease;
  @Input() subscriptions!: Disease[];
  trimmed_id!: number;
  constructor() { }

  ngOnInit(): void {
    this.trimmed_id = +this.disease.gard_id.split('GARD:')[1]
  }

}
