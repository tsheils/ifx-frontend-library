import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DiseaseSubscriptionListComponent } from '@ncats-frontend-library/shared/rdas/disease-display';
import { RdasSubscriptionsComponent } from './rdas-subscriptions/rdas-subscriptions.component';

const ROUTES: Routes = [
  {
    path: '',
    component: RdasSubscriptionsComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    DiseaseSubscriptionListComponent,
    RdasSubscriptionsComponent,
  ],
})
export class FeaturesRdasRdasSubscriptionsModule {}
