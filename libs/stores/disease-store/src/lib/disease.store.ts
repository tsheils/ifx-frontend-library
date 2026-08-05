import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  AllDiseasesFieldCountsGQL,
 Disease,
  DiseaseQueryFactory, DiseaseQueryGQL, DiseaseStaticFiltersQueryGQL,
} from 'rdas-models';
import {
  _parseFilters,
  Filter,
  FilterCategory,
  FilterResponse,
} from 'utils-models';
import { computed, inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  switchMap,
  pipe,
  tap,
  filter,
  map,
} from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';


const queryFactory = new DiseaseQueryFactory();

class DiseaseFilterResponse {
  [key: string]: Filter[];
}


type DiseaseState = {
  allStaticFilters: FilterCategory[];
  staticDiseaseFilters: FilterCategory[];
  disease: Disease;
  isLoading: boolean; // has the DiseaseStore list been loaded
  error?: string | null; // last known error (if any)
};

const initialState: DiseaseState = {
  allStaticFilters: [{ label: 'diseases' } as FilterCategory],
  staticDiseaseFilters: [{ label: 'diseases' } as FilterCategory],
  disease: {} as Disease,
  isLoading: false,
};

export const DiseaseStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  // withComputed((state) => ({})),
  withMethods(
    (
      store,
      diseaseQuery= inject(DiseaseQueryGQL),
      staticFiltersQuery = inject(DiseaseStaticFiltersQueryGQL),
      allStaticFiltersQuery = inject(AllDiseasesFieldCountsGQL),
    ) => ({
      loadDisease: rxMethod<Params>(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true });
          }),
          switchMap((params) => {
            const query = queryFactory.getQuery(params);
            return diseaseQuery
              .watch({
                variables: query.params,
              })
              .valueChanges.pipe(
                tapResponse({
                  next: (res) => {
                    console.log(res);
                    if (res.dataState === 'complete') {
                      const data: {
                        diseases: Disease[];
                      } = (<unknown>res.data) as {
                        diseases: Disease[];
                      };
                      const diseaseArr: Disease[] = data.diseases.map(
                        (obj: Partial<Disease>) => new Disease(obj),
                      );

                      patchState(store, (state) => {
                        return {
                          disease: diseaseArr[0],
                          isLoading: false,
                        };
                      });
                    }
                  },
                  error: (err) => {
                    patchState(store, { isLoading: false });
                    console.error(err);
                  },
                }),
              );
          }),
        ),
      ),

      loadStaticDiseaseFilters: rxMethod<Params>(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true });
          }),
          switchMap((params) => {
            const query = queryFactory.getStaticFilterQuery(params);
            return staticFiltersQuery
              .watch({
                variables: query.params,
              })
              .valueChanges.pipe(
                tapResponse({
                  next: (res) => {
                    console.log(res);
                    if (res.dataState === 'complete') {
                      const data: {
                        diseases: Disease[];
                      } = (<unknown>res.data) as {
                        diseases: Disease[];
                      };
                      const diseaseArr: Disease[] = data.diseases.map(
                        (obj: Partial<Disease>) => new Disease(obj),
                      );
                      const filters = _parseFilters(
                        diseaseArr[0].filterCounts as DiseaseFilterResponse,
                      );
                      patchState(store, (state) => {
                        return {
                          staticDiseaseFilters: filters,
                          isLoading: false,
                        };
                      });
                    }
                  },
                  error: (err) => {
                    patchState(store, { isLoading: false });
                    console.error(err);
                  },
                }),
              );
          }),
        ),
      ),
      loadAllDiseaseFilters: rxMethod(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true });
          }),
          switchMap(() => {
            return allStaticFiltersQuery.watch().valueChanges.pipe(
              tapResponse({
                next: (res) => {
                  if (res.dataState === 'complete') {
                    const data: {
                      fieldCounts: [{ fieldCounts: DiseaseFilterResponse }];
                    } = (<unknown>res.data) as {
                      fieldCounts: [{ fieldCounts: DiseaseFilterResponse }];
                    };
                    const filters = _parseFilters(
                      data.fieldCounts[0].fieldCounts as DiseaseFilterResponse,
                    );

                    patchState(store, (state) => {
                      return {
                        ...state,
                        allStaticFilters: filters,
                        isLoading: false,
                      };
                    });
                  }
                },
                error: (err) => {
                  patchState(store, { isLoading: false });
                  console.error(err);
                },
              }),
            );
          }),
        ),
      ),
    }),
  ),

  /*  withHooks({
   // onInit(store, actions$ = inject(Actions)) {},}),
*/
);
