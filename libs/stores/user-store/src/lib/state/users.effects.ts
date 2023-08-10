import { Injectable } from '@angular/core';
import { User } from "@ncats-frontend-library/models/utils";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { map, mergeMap, tap, withLatestFrom } from "rxjs";
import { UserService } from "../user.service";

import * as UsersActions from './users.actions';
import { UsersPartialState } from "./users.reducer";

@Injectable()
export class UsersEffects {

  init = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.init),
        map(() => {
          const user = localStorage.getItem('userEntity');
          if(user) {
            return UsersActions.loginUserSuccess({ user: JSON.parse(user) })
          } else {
            return UsersActions.loginUserFailure({error: ''})
          }
          }
        )
      )
  );


  loginUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loginUser),
      mergeMap((action: {provider: string}) => {
        return this.userService.doLogin(action.provider)
          .pipe(
            map((res: any) =>
            {
            return  res.user;
            }),
            map((res: Partial<User>) => {
              const u: User = new User({
                displayName: res.displayName,
                photoURL: res.photoURL,
                uid: res.uid
              })
              return UsersActions.loginUserSuccess({ user: u });
            })
        // return DiseasesActions.fetchDiseaseFailure({error: "No Disease found"})
          )
      })
    )
  );


  loginEmailUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loginEmailUser),
      mergeMap((action: {email: string, pw: string}) => {
        return this.userService.doEmailLogin(action.email, action.pw)
          .pipe(
            map((res: { code?: string, message?: string, user?: Partial<User> }) => {
              if (res.code) {
               const errMessage: string = this._getErrorMesssage(res.code);
                return UsersActions.loginEmailUserFailure({ error: errMessage })
              } else {
                if (res.user) {
                  const u: User = new User({
                    displayName: res.user.displayName,
                    photoURL: res.user.photoURL,
                    uid: res.user.uid
                  })
                if (u) {
                  return UsersActions.loginUserSuccess({ user: u });
                } else {
                  return UsersActions.loginEmailUserFailure({ error: "Login Failed" })
                }
              } else {
                  return UsersActions.loginEmailUserFailure({ error: "Login Failed" })
                }
              }
            }))
      }))
  );

registerEmailUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.registerEmailUser),
      mergeMap((action: {email: string, pw: string}) => {
        return this.userService.doRegister(action.email, action.pw)
          .pipe(
            map((res: any) =>
            {
              return  res.user;
            }),
            map((res: Partial<User>) => {
              const u: User = new User({
                displayName: res.displayName,
                photoURL: res.photoURL,
                uid: res.uid
              })
              if(u) {
                return UsersActions.loginUserSuccess({ user: u });
              } else {
                return UsersActions.registerEmailUserFailure({error: "Registration Failed"})
              }
            }))
            }))
  );


loginLinkUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loginLinkUser),
      mergeMap((action: {email: string}) => {
        return this.userService.doEmailLinkLogin(action.email)
          .pipe(
            map((res: any) => {
              if(res) {
                return UsersActions.loginLinkUserSuccess({ email: action.email });
              } else {
                return UsersActions.loginLinkUserFailure({error: "Login Link Failed"})
              }
            }))
      })
    )
  );

resetEmailPassword = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.resetPasswordEmail),
      mergeMap((action: {email: string}) => {
        return this.userService.doResetEmail(action.email)
          .pipe(
            map((res: any) => {
              if (res && res.code) {
                const errMessage: string = this._getErrorMesssage(res.code);
                return UsersActions.loginEmailUserFailure({ error: errMessage })
              } else  {
                return UsersActions.resetPasswordEmailSuccess();
              }
            }))
      })
    )
  );

  logoutUser = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.logoutUser),
        tap(() => {
            this.userService.logout();
            localStorage.removeItem('userEntity');
            return UsersActions.logoutUserSuccess();
          }
        )
      ),
    {dispatch: false}
  );

  fetchUserProfile = createEffect( ()=>
  this.actions$.pipe(
    ofType(UsersActions.loginUserSuccess),
    mergeMap((action: { user: User}) => {
      return this.userService.fetchUserProfile(action.user)
        .pipe(
          map((res) => {
            let user: User = action.user;
               if (res && !res.exists) {
                    this.userService.createUserProfile(user);
                  } else {
                    user = res.data() as User;
                    localStorage.removeItem('userEntity');
                    localStorage.setItem('userEntity', JSON.stringify(user));
                  }
              return UsersActions.fetchUserProfileSuccess({ user: user });
                })
        )
    })
  )
  )

updateUserProfile = createEffect( ()=>
  this.actions$.pipe(
    ofType(UsersActions.updateUserSubscriptions),
    withLatestFrom(this.store),
    mergeMap(([action, state]) => {
         const newUser: User = new User({...state.users.entities[state.users.selectedId || 'null' ], subscriptions: action.subscriptions})
      return this.userService.updateUserProfile(newUser)
        .pipe(
          map((res) => {
            const user = res.data() as User;
            localStorage.removeItem('userEntity');
            localStorage.setItem('userEntity', JSON.stringify(res.data()));
            return UsersActions.updateUserSubscriptionsSuccess({user: user});
          })
        )
    })
  )
  )

  _getErrorMesssage(code: string): string {
    switch (code){
      case 'auth/user-not-found': {
        return 'User not found. Please double check your email address';
      }
      case 'auth/wrong-password': {
        return 'Invalid password';
      }
      case 'auth/invalid-email': {
          return 'Invalid email';
      }
      default: {
        return 'Unable to login with these credentials';
      }
    }
  }

  constructor(
    private readonly actions$: Actions,
    private userService: UserService,
    private store: Store<UsersPartialState>
  ) {}
}
