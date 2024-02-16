import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as AdmeActions from './adme.actions';
import * as AdmeFeature from './adme.reducer';

@Injectable()
export class AdmeEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdmeActions.initAdme),
      switchMap(() => of(AdmeActions.loadAdmeSuccess({ adme: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(AdmeActions.loadAdmeFailure({ error }));
      }),
    ),
  );
}
