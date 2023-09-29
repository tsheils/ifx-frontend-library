import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';
import * as DiseasesActions from "../../../../disease-store/src/lib/state/diseases.actions";
import * as DiseasesFeature from "../../../../disease-store/src/lib/state/diseases.reducer";

import * as FiltersActions from './filters.actions';
import * as FiltersFeature from './filters.reducer';
import * as FiltersSelectors from './filters.selectors';

@Injectable()
export class FiltersFacade {

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(FiltersSelectors.selectFiltersLoaded));
  allFilters$ = this.store.pipe(select(FiltersSelectors.selectAllFilters));
  selectedFilters$ = this.store.pipe(select(FiltersSelectors.selectEntity));

  constructor(private store: Store<FiltersFeature.FiltersPartialState>) {
  }
  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
