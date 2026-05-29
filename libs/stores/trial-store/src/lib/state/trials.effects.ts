
import { inject } from '@angular/core';
import { Params } from '@angular/router';
import { ObservableQuery } from '@apollo/client';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { filter, map, switchMap } from 'rxjs';
import { FetchTrialActions, FetchTrialsListActions } from './trials.actions';
import { DiseaseSelectors } from 'disease-store';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import {
  ClinicalTrial,
  ClinicalTrialListQueryGQL,
  ClinicalTrialQueryFactory,
  ClinicalTrialQueryGQL,
} from 'rdas-models';

const queryFactory = new ClinicalTrialQueryFactory();

interface ClinicalTrialQueryResponse {
  diseases: {
    allCount: number;
    clinicalTrials: ClinicalTrial[];
    filteredCount: {
      totalCount: {count: {nodes: number} }
    };
  }[];
}

export const loadClinicalTrialsList$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    clinicalTrialsListQuery = inject(ClinicalTrialListQueryGQL),
) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      concatLatestFrom(() => store.select(DiseaseSelectors.getSelected)),
      filter(([r, data]) => {
        return (
          !r.payload.routerState.url.includes('/diseases') &&
          r.payload.routerState.url.includes('/disease') &&
          (!data || r.payload.routerState.root.fragment === 'trials')
        );
      }),
      map(([r]) => {
        return r.payload.routerState.root.queryParams;
      }),
      switchMap((params: Params) => {
        const query = queryFactory.getQuery(params);
        return clinicalTrialsListQuery.watch({variables: query.params}).valueChanges
          .pipe(
          map((res: ObservableQuery.Result<unknown>) => {
            console.log(res);
            if (res && res.data) {
              const data = (res.data as ClinicalTrialQueryResponse).diseases[0];
              const clinicalTrialsList = data.clinicalTrials.map(
                (trial: Partial<ClinicalTrial>) => new ClinicalTrial(trial),
              );
              return FetchTrialsListActions.fetchTrialsListSuccess({
                clinicalTrials: clinicalTrialsList,
                allClinicalTrialsCount: data.allCount,
                clinicalTrialsCount: data.filteredCount.totalCount.count.nodes,
              });
            } else
              return FetchTrialsListActions.fetchTrialsListFailure({
                error: 'No clinical trials found',
              });
          }),
        );
      }),
    );
  },
  { functional: true },
);


export const fetchClinicalTrial$ = createEffect(
  (
    actions$ = inject(Actions),
    clinicalTrialQuery = inject(ClinicalTrialQueryGQL)
) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/trials') &&
          r.payload.routerState.url.startsWith('/trial'),
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams,
      ),
      switchMap((params) => {
        const query = queryFactory.getQuery(params);
       // return trialService.fetchClinicalTrials(query.query, query.params)
          return clinicalTrialQuery
            .watch({ variables: query.params })
            .valueChanges.pipe(
              map((trialsData: ObservableQuery.Result<unknown>) => {
                console.log(trialsData);
                const data: { clinicalTrials: ClinicalTrial[] } =
                  trialsData.data as {
                    clinicalTrials: ClinicalTrial[];
                  };
                if (data) {
                  const trial: ClinicalTrial = new ClinicalTrial(
                    data.clinicalTrials[0],
                  );
                  return FetchTrialActions.fetchTrialSuccess({ trial: trial });
                } else
                  return FetchTrialActions.fetchTrialFailure({
                    error: 'No Trial found',
                  });
              }),
            );
      }),
    );
  },
  { functional: true },
);

