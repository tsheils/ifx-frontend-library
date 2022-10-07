import { User } from "@ncats-frontend-library/models/utils";
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as UsersActions from './users.actions';

export const USERS_FEATURE_KEY = 'users';

export interface State extends EntityState<User> {
  selectedId?: string | number; // which Users record has been selected
  loaded: boolean; // has the Users list been loaded
  error?: string | null; // last known error (if any)
}

export interface UsersPartialState {
  readonly [USERS_FEATURE_KEY]: State;
}

export const usersAdapter: EntityAdapter<User> =
  createEntityAdapter<User>({
    selectId: user => user.uid
  });



export const initialState: State = usersAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const usersReducer = createReducer(
  initialState,
  on(
    UsersActions.loginUserSuccess,
    UsersActions.fetchUserProfileSuccess,
    UsersActions.updateUserSubscriptionsSuccess,
    (state, { user }) => usersAdapter.setOne(user, { ...state, loaded: true, selectedId: user.uid })
  ),
  on(
    UsersActions.logoutUser, (state) => usersAdapter.removeAll(state)
  ),
  on(UsersActions.loginUserFailure, (state, { error }) => ({ ...state, error }))
);

export function reducer(state: State | undefined, action: Action) {
  return usersReducer(state, action);
}
