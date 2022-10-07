import { Subscription, User } from "@ncats-frontend-library/models/utils";
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Users/API] Init');

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
  props<{ error: string }>()
);

export const fetchUserProfile = createAction(
  '[Users/API] Fetch User Profile User',
  props<{ user: User}>()
);

export const fetchUserProfileSuccess = createAction(
  '[Users/API] Fetch User Profile Success',
  props<{ user: User}>()
);

export const fetchUserProfileFailure = createAction(
  '[Users/API] Fetch User Profile Failure',
  props<{ error: string }>()
);

export const updateUserSubscriptions = createAction(
  '[Users/API] Update User Subscriptions',
  props<{ subscriptions: Subscription[]}>()
);

export const updateUserSubscriptionsSuccess = createAction(
  '[Users/API] Update User Subscriptions Success',
  props<{ user: User}>()
);

export const updateUserSubscriptionsFailure = createAction(
  '[Users/API] Update User Subscriptions Failure',
  props<{ error: string }>()
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
