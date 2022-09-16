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
    selectId: user => user.name
  });



export const initialState: State = usersAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const usersReducer = createReducer(
  initialState,
  // on(UsersActions.init, (state) => ({ ...state, loaded: false, error: null })),
  on(UsersActions.loginUserSuccess, (state, { user }) =>
    usersAdapter.setAll([user], { ...state, loaded: true })
  ),
  on(UsersActions.logoutUser, (state) => {
      console.log("logging out")
      return  usersAdapter.removeAll(state)

    }
  ),
  on(UsersActions.loginUserFailure, (state, { error }) => ({ ...state, error }))
);

export function reducer(state: State | undefined, action: Action) {
  return usersReducer(state, action);
}
