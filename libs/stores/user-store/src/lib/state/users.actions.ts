import { Subscription, User } from '@ncats-frontend-library/models/utils';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Users/API] Init');

export const resetPasswordEmail = createAction(
  '[Users/API] Reset Password Email',
  props<{
    email: string;
  }>()
);

export const resetPasswordEmailSuccess = createAction(
  '[Users/API] Reset Password Email Success'
);

export const resetPasswordEmailFailure = createAction(
  '[Users/API] Reset Password Email Failure',
  props<{ error: string | null | undefined }>()
);

export const loginLinkUser = createAction(
  '[Users/API] Login Link User',
  props<{
    email: string;
  }>()
);

export const loginLinkUserSuccess = createAction(
  '[Users/API] Login Link User Success',
  props<{
    email: string;
  }>()
);

export const loginLinkUserFailure = createAction(
  '[Users/API] Login Link User Failure',
  props<{ error: string | null | undefined }>()
);

export const loginEmailUser = createAction(
  '[Users/API] Login Email User',
  props<{
    email: string;
    pw: string;
  }>()
);

export const loginEmailUserSuccess = createAction(
  '[Users/API] Login Email User Success',
  props<{ user: User }>()
);

export const loginEmailUserFailure = createAction(
  '[Users/API] Login Email User Failure',
  props<{ error: string | null | undefined }>()
);

export const registerEmailUser = createAction(
  '[Users/API] Register Email User',
  props<{
    email: string;
    pw: string;
    pwVerify: string;
  }>()
);

export const registerEmailUserSuccess = createAction(
  '[Users/API] Register Email User Success',
  props<{ user: User }>()
);

export const registerEmailUserFailure = createAction(
  '[Users/API] Register Email User Failure',
  props<{ error: string | null | undefined }>()
);

export const loginUser = createAction(
  '[Users/API] Login User',
  props<{
    provider: string;
  }>()
);

export const loginUserSuccess = createAction(
  '[Users/API] Login User Success',
  props<{ user: User }>()
);

export const loginUserFailure = createAction(
  '[Users/API] Login User Failure',
  props<{ error: string | null | undefined }>()
);

export const fetchUserProfile = createAction(
  '[Users/API] Fetch User Profile User',
  props<{ user: User }>()
);

export const fetchUserProfileSuccess = createAction(
  '[Users/API] Fetch User Profile Success',
  props<{ user: User }>()
);

export const fetchUserProfileFailure = createAction(
  '[Users/API] Fetch User Profile Failure',
  props<{ error: string | null | undefined }>()
);

export const updateUserSubscriptions = createAction(
  '[Users/API] Update User Subscriptions',
  props<{ subscriptions: Subscription[] }>()
);

export const updateUserSubscriptionsSuccess = createAction(
  '[Users/API] Update User Subscriptions Success',
  props<{ user: User }>()
);

export const updateUserSubscriptionsFailure = createAction(
  '[Users/API] Update User Subscriptions Failure',
  props<{ error: string | null | undefined }>()
);

export const logoutUser = createAction('[Users/API] Logout User Success');

export const logoutUserSuccess = createAction(
  '[Users/API] Logout User Success'
);

export const logoutUserFailure = createAction(
  '[Users/API] Logout User Failure',
  props<{ error: string | null | undefined }>()
);

export const fetchUser = createAction('[Users/API] Fetch User Success');

export const fetchUserSuccess = createAction(
  '[Users/API] Fetch User Success',
  props<{ user: User }>()
);

export const fetchUserFailure = createAction(
  '[Users/API] Fetch User Failure',
  props<{ error: string | null | undefined }>()
);
