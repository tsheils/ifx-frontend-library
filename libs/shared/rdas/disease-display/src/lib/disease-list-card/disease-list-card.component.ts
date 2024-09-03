import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NavigationExtras, Router } from '@angular/router';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { SubscribeButtonComponent } from '@ncats-frontend-library/shared/rdas/subscribe-button';
import { BrowseDiseaseListActions } from '@ncats-frontend-library/stores/disease-store';
import { Store } from '@ngrx/store';
import { UserSelectors } from '@ncats-frontend-library/stores/user-store';

@Component({
  selector: 'ncats-frontend-library-disease-list-card',
  templateUrl: './disease-list-card.component.html',
  styleUrls: ['./disease-list-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    SubscribeButtonComponent,
    MatDivider,
  ],
})
export class DiseaseListCardComponent {
  private readonly store = inject(Store);
  router = inject(Router);
  disease = input<Disease>();

  navigate(id: string | undefined): void {
    if (id) {
      this.store.dispatch(
        BrowseDiseaseListActions.setDisease({
          disease: this.disease() as Disease,
        }),
      );
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: id,
        },
      };
      this.router.navigate(['/disease'], navigationExtras);
    }
  }
}
