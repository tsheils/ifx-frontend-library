import { CommonModule } from "@angular/common";
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NavigationExtras, Router } from '@angular/router';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { SubscribeButtonComponent } from '@ncats-frontend-library/shared/rdas/subscribe-button';

@Component({
  selector: 'ncats-frontend-library-disease-list-card',
  templateUrl: './disease-list-card.component.html',
  styleUrls: ['./disease-list-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    SubscribeButtonComponent
  ],
})
export class DiseaseListCardComponent {
  @Input() disease!: any | Disease;  //eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(private router: Router) {}

  navigate(id: string | undefined): void {
    if (id) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: id,
        },
      };
      this.router.navigate(['/disease'], navigationExtras);
    }
  }
}
