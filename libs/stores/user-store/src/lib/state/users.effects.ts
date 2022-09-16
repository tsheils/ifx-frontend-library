import { Injectable } from '@angular/core';
import { User } from "@ncats-frontend-library/models/utils";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { mergeMap } from "rxjs";
import { UserService } from "../user.service";

import * as UsersActions from './users.actions';
import * as UsersFeature from './users.reducer';

@Injectable()
export class UsersEffects {

  fetchUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.fetchUser),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return UsersActions.fetchUserSuccess({ user: {name: 'tim'} });
        },
        onError: (action, error) => {
          console.error('Error', error);
          return UsersActions.fetchUserFailure({ error });
        },
      })
    )
  );

  /*  loginUser = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersActions.loginUser),
        fetch({
          run: (action) => {
            console.log(action);
           return this.userService.doLogin(action.provider).then(
            return UsersActions.fetchUserSuccess({ user: {} });
          )
            // Your custom service 'load' logic goes here. For now just return a success action...
          },
          onError: (action, error) => {
            console.error('Error', error);
            return UsersActions.fetchUserFailure({ error });
          },
        })
      )
    );*/

  loginUser = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loginUser),
      mergeMap((action: any) => {
        return this.userService.doLogin(action.provider)
          .pipe(
            map((res: any) => {
              return UsersActions.loginUserSuccess({ user: new User({name: res.user.displayName, imageUrl: res.user.photoURL}) });
            })
            // return DiseasesActions.fetchDiseaseFailure({error: "No Disease found"})
          )
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private userService: UserService
  ) {}
}
