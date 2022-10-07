import { Injectable } from '@angular/core';
import { User } from "@ncats-frontend-library/models/utils";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import firebase from 'firebase/compat/app';
import { map, mergeMap, of, tap, withLatestFrom } from "rxjs";
import { UserService } from "../user.service";
import { logoutUser } from "./users.actions";

import * as UsersActions from './users.actions';
import { UsersPartialState } from "./users.reducer";
import * as UsersFeature from './users.reducer';

@Injectable()
export class UsersEffects {

  init = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.init),
        map(() => {
          const user = localStorage.getItem('userEntity');
          if(user) {
        //    const user: User = JSON.parse(localStorage.getItem('userEntity') || 'null');
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
              console.log(res);
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
        //    localStorage.removeItem('userEntity');
        //    return UsersActions.logoutUser();
          }
        )
      ),
    {dispatch: false}
  );

  fetchUserProfile = createEffect( ()=>
  this.actions$.pipe(
    ofType(UsersActions.loginUserSuccess),
    mergeMap((action: any) => {
      console.log(action);
      return of(this.userService.fetchUserProfile(action.user))
        .pipe(
          map((res: any) => {
            console.log(res);
            return UsersActions.fetchUserProfileSuccess({ user: action.user });
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
      return of(this.userService.updateUserProfile(newUser))
        .pipe(
          map((res) => {
            console.log(res);
            console.log("update user profile in effects")
            console.log(newUser);
        //    localStorage.setItem('userEntity', JSON.stringify(newUser));
            return UsersActions.updateUserSubscriptionsSuccess({user: newUser});
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
