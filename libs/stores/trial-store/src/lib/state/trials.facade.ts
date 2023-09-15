import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as TrialsActions from './trials.actions';
import * as TrialsSelectors from './trials.selectors';

@Injectable()
export class TrialsFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(TrialsSelectors.selectTrialsLoaded));
  allTrials$ = this.store.pipe(select(TrialsSelectors.selectAllTrials));
  selectedTrials$ = this.store.pipe(select(TrialsSelectors.selectEntity));

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(TrialsActions.initTrials());
  }
}
