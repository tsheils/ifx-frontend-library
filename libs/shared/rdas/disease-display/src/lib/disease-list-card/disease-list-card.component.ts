import { Component, Input } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { Disease } from "@ncats-frontend-library/models/rdas";

@Component({
  selector: 'ncats-frontend-library-disease-list-card',
  templateUrl: './disease-list-card.component.html',
  styleUrls: ['./disease-list-card.component.scss']
})
export class DiseaseListCardComponent {
  @Input() disease!:Disease;

  constructor(
    private router: Router
  ) { }

  navigate(id: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams:{
        id: id
      }
    };
    this.router.navigate(['/disease'], navigationExtras);
  }
}

