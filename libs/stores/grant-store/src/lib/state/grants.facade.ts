import { inject, Injectable } from "@angular/core";
import { select, Store, Action } from '@ngrx/store';
import * as GrantsActions from './grants.actions';
import * as GrantsFeature from './grants.reducer';
import * as GrantsSelectors from './grants.selectors';

@Injectable()
export class GrantsFacade {
  private readonly store = inject(Store);
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(GrantsSelectors.selectGrantsLoaded));
  allGrants$ = this.store.pipe(select(GrantsSelectors.selectAllGrants));
  selectedGrants$ = this.store.pipe(select(GrantsSelectors.selectEntity));

  dispatch(action: Action) {
    this.store.dispatch(action);
  }

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(GrantsActions.initGrants());
  }
}
