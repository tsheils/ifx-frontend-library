import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as FiltersActions from './filters.actions';
import * as FiltersFeature from './filters.reducer';
import * as FiltersSelectors from './filters.selectors';

@Injectable()
export class FiltersFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(FiltersSelectors.selectFiltersLoaded));
  allFilters$ = this.store.pipe(select(FiltersSelectors.selectAllFilters));
  selectedFilters$ = this.store.pipe(select(FiltersSelectors.selectEntity));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(FiltersActions.initFilters());
  }
}
