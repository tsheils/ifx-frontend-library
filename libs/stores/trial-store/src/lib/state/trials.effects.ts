import { Injectable, inject } from '@angular/core';
import {
  ClinicalTrial,
  FETCHTRIALDETAILS,
  TRIALDETAILSVARIABLES
} from "@ncats-frontend-library/models/rdas";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from "@ngrx/router-store";
import { Store } from "@ngrx/store";
import { switchMap, catchError, of, filter, map } from "rxjs";
import { TrialService } from "../trial.service";
import * as TrialsActions from './trials.actions';
import * as TrialsFeature from './trials.reducer';

@Injectable()
export class TrialsEffects {
  constructor(
    private actions$: Actions,
    private trialService: TrialService,
    private store: Store
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TrialsActions.initTrials),
      switchMap(() => of(TrialsActions.loadTrialsSuccess({ trials: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(TrialsActions.loadTrialsFailure({ error }));
      })
    )
  );

  loadTrial$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) => !r.payload.routerState.url.includes('/trials') && r.payload.routerState.url.startsWith('/trial')),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      switchMap((params: {nctid?: string}) => {
        TRIALDETAILSVARIABLES.ctwhere.NCTId =  params.nctid;
        return this.trialService.fetchTrials(FETCHTRIALDETAILS, TRIALDETAILSVARIABLES)
          .pipe(
            map((trialData: any) => {
              console.log(trialData);
              if (trialData.data) {
                const trial: ClinicalTrial = new ClinicalTrial(trialData.data.clinicalTrials[0]);
                return TrialsActions.fetchTrialSuccess({ trial: trial });
              } else return TrialsActions.fetchTrialFailure({ error: "No Disease found" });
            })
          );
      })
    )}
  );
}
