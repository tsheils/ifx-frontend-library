import { Component, Input, OnInit } from "@angular/core";
import { Disease } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-disease-list',
  templateUrl: './disease-list.component.html',
  styleUrls: ['./disease-list.component.scss']
})
export class DiseaseListComponent implements OnInit {
  @Input() diseases!: Disease[];
  @Input() loading = true;

  constructor() { }

  ngOnInit(): void {
  }

}
