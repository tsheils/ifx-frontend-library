import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { Disease } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-identifiers-display',
  templateUrl: './identifiers-display.component.html',
  styleUrls: ['./identifiers-display.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IdentifiersDisplayComponent implements OnInit {
  @Input() disease!: Disease;
  constructor() { }

  ngOnInit(): void {
  }

}
