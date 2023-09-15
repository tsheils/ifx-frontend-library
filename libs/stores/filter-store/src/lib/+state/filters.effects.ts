import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as FiltersActions from './filters.actions';
import * as FiltersFeature from './filters.reducer';

@Injectable()
export class FiltersEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FiltersActions.initFilters),
      switchMap(() => of(FiltersActions.loadFiltersSuccess({ filters: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(FiltersActions.loadFiltersFailure({ error }));
      })
    )
  );
}
