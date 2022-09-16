import { User } from "@ncats-frontend-library/models/utils";
import { createAction, props } from '@ngrx/store';

const openLogin = createAction(
  '[Users/API] Open Login',
  props<{component:unknown, data:unknown}>()
)

const dialogSaved = createAction(
  '[Home Page] Dialog Saved',
  props<{data:unknown}>()
)

const dialogClosed = createAction(
  '[Home Page] Dialog Closed',
  props<{data:unknown}>()
)

export const loginUser = createAction(
  '[Users/API] Login User',
  props<{ provider: string}>()
);

export const loginUserSuccess = createAction(
  '[Users/API] Login User Success',
  props<{ user: User}>()
);

export const loginUserFailure = createAction(
  '[Users/API] Login User Failure',
  props<{ error: never }>()
);

export const logoutUser = createAction(
  '[Users/API] Logout User Success'
);

export const logoutUserSuccess = createAction(
  '[Users/API] Logout User Success'
);

export const logoutUserFailure = createAction(
  '[Users/API] Logout User Failure',
  props<{ error: never }>()
);

export const fetchUser = createAction(
  '[Users/API] Fetch User Success'
);

export const fetchUserSuccess = createAction(
  '[Users/API] Fetch User Success',
  props<{ user: User}>()
);

export const fetchUserFailure = createAction(
  '[Users/API] Fetch User Failure',
  props<{ error: never }>()
);
