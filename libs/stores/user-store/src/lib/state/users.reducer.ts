import { User } from 'utils-models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import {
  LoginEmailUserActions,
  LoginLinkActions,
  RdasUsersInitActions,
  RegisterEmailUserActions,
  ResetPasswordEmailActions,
  UpdateUserActions,
  UserLoginActions,
} from './users.actions';

export const USERS_FEATURE_KEY = 'user';

export interface UserState extends EntityState<User> {
  selectedId?: string | number; // which Users record has been selected
  loaded: boolean; // has the Users list been loaded
  error?: string | null; // last known error (if any)
  email?: string | null;
}

export interface UsersPartialState {
  readonly [USERS_FEATURE_KEY]: UserState;
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user) => user.uid,
});

export const initialState: UserState = usersAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialState,
  on(
    RdasUsersInitActions.initSuccess,
    LoginEmailUserActions.loginEmailUserSuccess,
    RegisterEmailUserActions.registerEmailUserSuccess,
    UserLoginActions.loginUserSuccess,
    UserLoginActions.fetchUserProfileSuccess,
    UpdateUserActions.updateUserSubscriptionsSuccess,
    (state, { user }) =>
      usersAdapter.setOne(user, {
        ...state,
        loaded: true,
        selectedId: user.uid,
      })
  ),
  on(ResetPasswordEmailActions.resetPasswordEmailSuccess, (state) => {
    return { ...state, email: 'reset' };
  }),
  on(LoginLinkActions.loginLinkUserSuccess, (state, { email }) => ({
    ...state,
    email: email,
  })),
  on(UserLoginActions.logoutUserSuccess, (state) => {
    return usersAdapter.removeAll(state);
  }),

  on(
    RdasUsersInitActions.initFailure,
    UserLoginActions.loginUserFailure,
    UpdateUserActions.updateUserSubscriptionsFailure,
    RegisterEmailUserActions.registerEmailUserFailure,
    LoginEmailUserActions.loginEmailUserFailure,
    LoginLinkActions.loginLinkUserFailure,
    (state, { error }) => ({ ...state, error })
  )
);

export function usersReducer(state: UserState | undefined, action: Action) {
  return reducer(state, action);
}
