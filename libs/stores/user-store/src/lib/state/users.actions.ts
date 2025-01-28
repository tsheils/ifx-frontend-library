import { Subscription, User } from '@ncats-frontend-library/models/utils'
import { createActionGroup, emptyProps, props } from '@ngrx/store'

export const RdasUsersInitActions = createActionGroup({
  source: 'Users Init',
  events: {
    init: emptyProps(),
    initSuccess: props<{ user: User }>(),
    initFailure: props<{ error: string }>(),
  },
})

export const ResetPasswordEmailActions = createActionGroup({
  source: 'Reset Password Email',
  events: {
    resetPasswordEmail: props<{ email: string }>(),
    resetPasswordEmailSuccess: emptyProps(),
    resetPasswordEmailFailure: props<{ error: string }>(),
  },
})

export const LoginLinkActions = createActionGroup({
  source: 'Login Link',
  events: {
    loginLinkUser: props<{ email: string }>(),
    loginLinkUserSuccess: props<{ email: string }>(),
    loginLinkUserFailure: props<{ error: string }>(),
  },
})

export const LoginEmailUserActions = createActionGroup({
  source: 'Login Email User',
  events: {
    loginEmailUser: props<{ email: string; pw: string }>(),
    loginEmailUserSuccess: props<{ user: User }>(),
    loginEmailUserFailure: props<{ error: string }>(),
  },
})

export const RegisterEmailUserActions = createActionGroup({
  source: 'Login Email User',
  events: {
    RegisterEmailUser: props<{ email: string; pw: string; pwVerify: string }>(),
    RegisterEmailUserSuccess: props<{ user: User }>(),
    RegisterEmailUserFailure: props<{ error: string }>(),
  },
})

export const UserLoginActions = createActionGroup({
  source: 'User',
  events: {
    loginUser: props<{ provider: string }>(),
    loginUserSuccess: props<{ user: User }>(),
    loginUserFailure: props<{ error: string }>(),
    fetchUserProfile: props<{ user: User }>(),
    fetchUserProfileSuccess: props<{ user: User }>(),
    fetchUserProfileFailure: props<{ error: string }>(),
    logoutUser: emptyProps(),
    logoutUserSuccess: emptyProps(),
    logoutUserFailure: props<{ error: string }>(),
  },
})

export const UpdateUserActions = createActionGroup({
  source: 'Login Email User',
  events: {
    updateUserSubscriptions: props<{ subscriptions: Subscription[] }>(),
    updateUserSubscriptionsSuccess: props<{ user: User }>(),
    updateUserSubscriptionsFailure: props<{ error: string }>(),
  },
})

/*
export const fetchUser = createAction('[Users/API] Fetch User Success');

export const fetchUserSuccess = createAction(
  '[Users/API] Fetch User Success',
  props<{ user: User }>()
);

export const fetchUserFailure = createAction(
  '[Users/API] Fetch User Failure',
  props<{ error: string | null | undefined }>()
);
*/
