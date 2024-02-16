import { inject } from "@angular/core";
import { ApolloQueryResult } from '@apollo/client';
import {
  ClinicalTrial,
  FETCHTRIALDETAILS,
  TRIALDETAILSVARIABLES,
} from '@ncats-frontend-library/models/rdas';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { filter, map, mergeMap } from "rxjs";
import { TrialService } from '../trial.service';
import { FetchTrialActions } from "./trials.actions";


  export const loadTrial$ = createEffect(
  (
    actions$ = inject(Actions),
    trialService = inject(TrialService)
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/trials') &&
          r.payload.routerState.url.startsWith('/trial')
      ),
    map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      mergeMap((params: { nctid?: string }) => {
              TRIALDETAILSVARIABLES.ctwhere.NCTId = params.nctid;
              return trialService
                .fetchTrials(FETCHTRIALDETAILS, TRIALDETAILSVARIABLES)
                .pipe(
                  map((trialData: ApolloQueryResult<unknown>) => {
                    const data: { clinicalTrials: ClinicalTrial[] } = trialData.data as { clinicalTrials: ClinicalTrial[] };
                    if (data) {
                      const trial: ClinicalTrial = new ClinicalTrial(
                        data.clinicalTrials[0]
                      );
                      return FetchTrialActions.fetchTrialSuccess({ trial: trial });
                    } else
                      return FetchTrialActions.fetchTrialFailure({
                        error: 'No Disease found',
                      });
                  })
                );
            })
        );
      }, {functional: true}
  )
