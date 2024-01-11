import { inject, Injectable } from "@angular/core";
import { select, Store, Action } from '@ngrx/store';

import * as DiseasesActions from './diseases.actions';
import * as DiseasesSelectors from './diseases.selectors';

@Injectable()
export class DiseasesFacade {
  private readonly store = inject(Store);

  /**
   /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(DiseasesSelectors.getDiseasesLoaded));
  allDiseases$ = this.store.selectSignal(DiseasesSelectors.getAllDiseases);
  diseaseTree$ = this.store.pipe(select(DiseasesSelectors.getDiseaseTree));
  selectedDiseases$ = this.store.selectSignal(DiseasesSelectors.getSelected);
  diseaseFilters$ = this.store.selectSignal(DiseasesSelectors.getDiseaseFilters);
  subscribedDiseases$ = this.store.selectSignal(
    DiseasesSelectors.getDiseasesSubscriptions
  );
  searchDiseases$ = this.store.pipe(
    select(DiseasesSelectors.searchDiseasesEntities)
  );
  page$ = this.store.pipe(select(DiseasesSelectors.getDiseasesPage));

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.dispatch(DiseasesActions.init());
  }
}
