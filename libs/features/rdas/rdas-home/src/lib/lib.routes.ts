import { Route } from '@angular/router';
import { DiseasesEffects, DiseasesFacade } from "@ncats-frontend-library/stores/disease-store";
import { UsersEffects, UsersFacade } from "@ncats-frontend-library/stores/user-store";
import { provideStore, provideState } from '@ngrx/store';
import * as fromUsers from '@ncats-frontend-library/stores/user-store';
import * as fromDiseases from '@ncats-frontend-library/stores/disease-store';

import { provideEffects } from '@ngrx/effects';
import { RdasHomeComponent } from "./rdas-home/rdas-home.component";

export const rdasHomeRoutes: Route[] = [
  {
    path: '',
    component: RdasHomeComponent,
    providers: [
      UsersFacade,
      provideState(fromUsers.USERS_FEATURE_KEY, fromUsers.usersReducer),
      provideEffects(UsersEffects),
      DiseasesFacade,
      provideState(fromDiseases.DISEASES_FEATURE_KEY, fromDiseases.diseasesReducer),
      provideEffects(DiseasesEffects),
    ],
  },
];
