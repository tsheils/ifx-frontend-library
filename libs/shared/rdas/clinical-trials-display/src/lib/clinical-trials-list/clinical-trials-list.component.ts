import {
  Component,
  Input,
} from "@angular/core";
import { NavigationExtras, Router } from '@angular/router';
import { ClinicalTrial } from '@ncats-frontend-library/models/rdas';
import { ClinicalTrialsListCardComponent } from '../clinical-trials-list-card/clinical-trials-list-card.component';

@Component({
  selector: 'ncats-frontend-library-clinical-trials-list',
  templateUrl: './clinical-trials-list.component.html',
  styleUrls: ['./clinical-trials-list.component.scss'],
  standalone: true,
  imports: [
    ClinicalTrialsListCardComponent
  ],
})
export class ClinicalTrialsListComponent {
  @Input() trials!: ClinicalTrial[] | undefined;

  constructor(
    private router: Router) {}

  navigate(id: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        nctid: id,
      },
    };
    this.router.navigate(['/trial'], navigationExtras);
  }
}
