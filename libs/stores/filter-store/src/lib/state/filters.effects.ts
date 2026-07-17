import { inject } from '@angular/core';
import { Params } from '@angular/router';
import { ObservableQuery } from '@apollo/client';
import {
  GeneQueryFactory,
  PhenotypeQueryFactory,
  RdasQueryFactory,
} from 'rdas-models';
import { Filter, FilterCategory, FilterResponse } from 'utils-models';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import {
  filter,
  map,
  combineLatest,
  ObservableInput,
  Observable,
  mergeMap,
} from 'rxjs';
import { FilterService } from '../filter.service';
import { FetchFiltersActions } from './filters.actions';
import * as FiltersSelectors from './filters.selectors';

const filterMap: Map<string, PhenotypeQueryFactory> = new Map<
  string,
  GeneQueryFactory | PhenotypeQueryFactory
>([
  // ['genes', new GeneQueryFactory()],
  ['phenotypes', new PhenotypeQueryFactory()],
]);

/*
function parseFilterResponse(
  res: FilterResponse,
  currentFilter?: FilterCategory,
): FilterCategory[] {
  const filters: FilterCategory[] = [];
  if (Object.keys(res).length) {
    Object.keys(res).forEach((key: string) => {
      const retMap: Map<string, Filter> = new Map<string, Filter>();
      const selectedFiltersData: { selectedFilters: Filter[] } = res[
        key as keyof FilterResponse
      ].data as { selectedFilters: Filter[] };
      if (selectedFiltersData) {
        //selected/checked filters always go on top
        selectedFiltersData.selectedFilters?.forEach((obj: Partial<Filter>) => {
          retMap.set(
            <string>obj.term,
            new Filter({
              ...obj,
              selected: true,
            }),
          );
        });
      }
      //search term
      // }
      const searchFiltersData: { searchFilters: Filter[] } = res[key].data as {
        searchFilters: Filter[];
      };
      if (searchFiltersData) {
        searchFiltersData.searchFilters.forEach((obj: Partial<Filter>) => {
          if (!retMap.has(<string>obj.term)) {
            retMap.set(
              <string>obj.term,
              new Filter({
                ...obj,
              }),
            );
          }
        });
        //current values (just for pagination)
        currentFilter?.values.forEach((filter) => {
          if (!retMap.has(<string>filter.term)) {
            retMap.set(<string>filter.term, filter);
          }
        });
      }
      //everything else
      const allFiltersData: { allFilters: Filter[] } = res[key].data as {
        allFilters: Filter[];
      };
      if (allFiltersData) {
        allFiltersData.allFilters.forEach((obj: Partial<Filter>) => {
          if (!retMap.has(<string>obj.term)) {
            retMap.set(
              <string>obj.term,
              new Filter({
                ...obj,
              }),
            );
          }
        });
      }
      const filterCategory: FilterCategory = new FilterCategory({
        label: key,
        values: [...retMap.values()],
        page: currentFilter?.page || 0,
        query: currentFilter?.query,
      });
      filterCategory.values = [...retMap.values()].sort(
        (a, b) => Number(b.selected) - Number(a.selected),
      );
      filters.push(filterCategory as FilterCategory);
    });
  }
  return filters;
}
*/

/**
 * initial load and paging of filter list
 */

/*
export const loadFilters$ = createEffect(
  (actions$ = inject(Actions), filterService = inject(FilterService)) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) =>
        r.payload.routerState.url.startsWith('/diseases'),
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams,
      ),
      mergeMap((params: Params) => {
        console.log("load filters")
        const queries: { [key: string]: ObservableInput<unknown> } = {};
        console.log(queries);
        [...filterMap.keys()].forEach((selectedFilter: string | undefined) => {
          console.log(selectedFilter)
          console.log(filterMap)
          if (selectedFilter != null) {
            const factory = filterMap.get(selectedFilter);
            if (factory) {
              const query = factory.getQuery(params);
              queries[selectedFilter] = filterService.fetchDiseases(
                query.query,
                query.params,
              );
            }
          }
        });
        return combineLatest(queries).pipe(
          map((res: unknown) => {
            console.log(res)
            const data = res as FilterResponse;
            if (data) {
              const filters = parseFilterResponse(data);
              console.log(filters)
              if(filters[0].values.length) {
                return FetchFiltersActions.fetchFiltersSuccess({
                  filters: filters,
                });
              } else return FetchFiltersActions.fetchFiltersFailure({
                  error: 'No new filters found',
                });
            } else {
              return FetchFiltersActions.fetchFiltersFailure({
                error: 'No Disease found',
              });
            }
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const searchFilters$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    filterService = inject(FilterService),
  ) => {
    return actions$.pipe(
      ofType(FetchFiltersActions.fetchFilters),
      concatLatestFrom(() => store.select(FiltersSelectors.selectAllFilters)),
      mergeMap(([action, currentFilters]) => {
        console.log("search filters")
        const queries: {
          [key: string]: Observable<ObservableQuery.Result<unknown>>;
        } = {};
        let nextPage = 1;
        //map previous filters to sync later
        const currentFiltersMap: Map<string, FilterCategory> = new Map<
          string,
          FilterCategory
        >();
        currentFilters.forEach((filter: FilterCategory) =>
          currentFiltersMap.set(filter.label, filter),
        );
        //get current searched/paged/selected filter, mainly for the current values
        let filterMatch: FilterCategory | undefined = currentFiltersMap.get(
          action.label,
        );
        if (!filterMatch) {
          filterMatch = new FilterCategory({
            values: [],
            page: 2,
            label: action.label,
          });
        }
        //get queries and parameters
        const factory = filterMap.get(action.label);
        if (factory) {
          const query = factory.getQuery(action);
          queries[action.label] = filterService.fetchDiseases(
            query.query,
            query.params,
          );
          if (action.term) {
            //   params.parameters['term'] = action.term;
            nextPage = 1;
          }
          if (action.terms) {
            //     params.parameters['terms'] = action.terms;
            nextPage = 0;
          }

          //update next page parameter (is this needed?)
          if (action.skip) {
            nextPage = filterMatch?.page + 1;
          }
        }
        return combineLatest(queries).pipe(
          map((res: { [key: string]: ObservableQuery.Result<unknown> }) => {
            if (res) {
              const tempFilter = new FilterCategory({
                ...filterMatch,
                page: nextPage,
                query: action.term,
              });
              const filter = parseFilterResponse(
                res as FilterResponse,
                tempFilter,
              );
              return FetchFiltersActions.fetchFiltersSuccess({
                filters: filter,
              });
            } else
              return FetchFiltersActions.fetchFiltersFailure({
                error: 'No Disease found',
              });
          }),
        );
      }),
    );
  },
  { functional: true },
);
*/
