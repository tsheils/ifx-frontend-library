import { inject, Injectable } from "@angular/core";
import { select, Store, Action } from '@ngrx/store';
import * as UsersSelectors from './users.selectors';

@Injectable()
export class UsersFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(UsersSelectors.getUsersLoaded));
  user$ = this.store.pipe(select(UsersSelectors.getUser));
  selectedUsers$ = this.store.pipe(select(UsersSelectors.getSelected));
  email$ = this.store.pipe(select(UsersSelectors.getEmail));
  error$ = this.store.pipe(select(UsersSelectors.getUsersError));

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
