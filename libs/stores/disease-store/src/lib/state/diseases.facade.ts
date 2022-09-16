import { Injectable } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as DiseasesActions from './diseases.actions';
import * as DiseasesFeature from './diseases.reducer';
import * as DiseasesSelectors from './diseases.selectors';

@Injectable()
export class DiseasesFacade {
  /**
   /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(DiseasesSelectors.getDiseasesLoaded));
  allDiseases$ = this.store.pipe(select(DiseasesSelectors.getAllDiseases));
  selectedDiseases$ = this.store.pipe(select(DiseasesSelectors.getSelected));
  searchDiseases$ = this.store.pipe(select(DiseasesSelectors.searchDiseasesEntities));


  constructor(private store: Store<DiseasesFeature.DiseasesPartialState>) {
  }
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
