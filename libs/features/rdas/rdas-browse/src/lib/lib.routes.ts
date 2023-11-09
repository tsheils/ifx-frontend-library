import { Route } from '@angular/router';
import {
  DiseasesEffects,
  DiseasesFacade,
} from '@ncats-frontend-library/stores/disease-store';
import {
  FiltersEffects,
  FiltersFacade,
} from '@ncats-frontend-library/stores/filter-store';
import { RdasBrowseComponent } from './rdas-browse/rdas-browse.component';
import {
  UsersEffects,
  UsersFacade,
} from '@ncats-frontend-library/stores/user-store';
import { provideState } from '@ngrx/store';
import * as fromUsers from '@ncats-frontend-library/stores/user-store';
import * as fromDiseases from '@ncats-frontend-library/stores/disease-store';
import * as fromFilters from '@ncats-frontend-library/stores/filter-store';

import { provideEffects } from '@ngrx/effects';

export const rdasBrowseRoutes: Route[] = [
  {
    path: '',
    component: RdasBrowseComponent,
    providers: [
      UsersFacade,
      provideState(fromUsers.USERS_FEATURE_KEY, fromUsers.usersReducer),
      provideEffects(UsersEffects),
      DiseasesFacade,
      provideState(
        fromDiseases.DISEASES_FEATURE_KEY,
        fromDiseases.diseasesReducer
      ),
      provideEffects(DiseasesEffects),
      FiltersFacade,
      provideState(fromFilters.FILTERS_FEATURE_KEY, fromFilters.filtersReducer),
      provideEffects(FiltersEffects),
    ],
  },
];
