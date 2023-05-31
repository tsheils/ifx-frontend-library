import { User } from "@ncats-frontend-library/models/utils";
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as UsersActions from './users.actions';

export const USERS_FEATURE_KEY = 'users';

export interface State extends EntityState<User> {
  selectedId?: string | number; // which Users record has been selected
  loaded: boolean; // has the Users list been loaded
  error?: string | null; // last known error (if any)
  email?: string | null;
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

export const usersReducer = createReducer(
  initialState,
  on(
    UsersActions.loginUserSuccess,
    UsersActions.fetchUserProfileSuccess,
    UsersActions.updateUserSubscriptionsSuccess,
    (state, { user }) => usersAdapter.setOne(user, { ...state, loaded: true, selectedId: user.uid })
  ),
  on(
    UsersActions.resetPasswordEmailSuccess, (state) =>{
        console.log("you");
      return { ...state, email: 'reset' }
    }
    ),
  on(
    UsersActions.loginLinkUserSuccess, (state, {email}) =>({
    ...state, email: email
  })),
  on(
    UsersActions.logoutUserSuccess, (state) => usersAdapter.removeAll(state)
  ),
  on(
    UsersActions.loginUserFailure,
    UsersActions.loginEmailUserFailure,
    UsersActions.loginLinkUserFailure,
    (state, { error }) => ({ ...state, error }))
);

export function reducer(state: State | undefined, action: Action) {
  return usersReducer(state, action);
}
