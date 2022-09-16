import { Component, Input, OnInit } from "@angular/core";
import { Disease } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-identifiers-display',
  templateUrl: './identifiers-display.component.html',
  styleUrls: ['./identifiers-display.component.scss']
})
export class IdentifiersDisplayComponent implements OnInit {
  @Input() disease!: Disease;
  constructor() { }

  ngOnInit(): void {
  }

}
