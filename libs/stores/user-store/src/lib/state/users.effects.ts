import { Injectable } from '@angular/core';
import { User } from "@ncats-frontend-library/models/utils";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { map, mergeMap, of, tap, withLatestFrom } from "rxjs";
import { UserService } from "../user.service";
import { logoutUserSuccess } from "./users.actions";

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
            return UsersActions.loginUserFailure({error: 'oops'})
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

  constructor(
    private readonly actions$: Actions,
    private userService: UserService,
    private store: Store<UsersPartialState>
  ) {}
}
