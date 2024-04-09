import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as RampActions from './ramp.actions';
import * as RampFeature from './ramp.reducer';

@Injectable()
export class RampEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.initRamp),
      switchMap(() => of(RampActions.loadRampSuccess({ ramp: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(RampActions.loadRampFailure({ error }));
      }),
    ),
  );
}
