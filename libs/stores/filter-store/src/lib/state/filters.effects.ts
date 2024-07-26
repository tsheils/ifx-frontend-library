import { inject } from '@angular/core';
import { Params } from '@angular/router';
import { ApolloQueryResult, DocumentNode } from '@apollo/client';
import {
  GENEFILTERPARAMETERS,
  GENEFILTERS,
  PHENOTYPEFILTERPARAMETERS,
  PHENOTYPEFILTERS,
} from '@ncats-frontend-library/models/rdas';
import { Filter, FilterCategory } from '@ncats-frontend-library/models/utils';
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

interface FilterResponse {
  [key: string]: {
    data: {
      allFilters: Filter[];
      searchFilters: [];
      selectedFilters: [];
    };
  };
}

const filterMap: Map<
  string,
  { query: DocumentNode; parameters: { [key: string]: unknown } }
> = new Map<
  string,
  { query: DocumentNode; parameters: { [key: string]: unknown } }
>([
  [
    'phenotypes',
    {
      query: PHENOTYPEFILTERS,
      parameters: PHENOTYPEFILTERPARAMETERS,
    },
  ],
  [
    'genes',
    {
      query: GENEFILTERS,
      parameters: GENEFILTERPARAMETERS,
    },
  ],
]);

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
        selectedFiltersData.selectedFilters.forEach((obj: Partial<Filter>) => {
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
          if (!retMap.has(filter.term)) {
            retMap.set(filter.term, filter);
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
        page: currentFilter?.page,
        query: currentFilter?.query,
      });
      filters.push(filterCategory);
    });
  }
  return filters;
}

/**
 * initial load and paging of filter list
 */

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
        const queries: { [key: string]: ObservableInput<unknown> } = {};
        [...filterMap.keys()].forEach((selectedFilter: string | undefined) => {
          if (selectedFilter != null) {
            const queryParams = filterMap.get(selectedFilter);
            if (queryParams) {
              if (params[selectedFilter]) {
                queryParams.parameters['terms'] =
                  params[selectedFilter].split('&');
              } else {
                queryParams.parameters['terms'] = [];
              }
              queries[selectedFilter] = filterService.fetchDiseases(
                queryParams.query,
                queryParams.parameters,
              );
            }
          }
        });
        return combineLatest(queries).pipe(
          map((res: unknown) => {
            const data = res as FilterResponse;
            if (data) {
              const filters = parseFilterResponse(data);
              return FetchFiltersActions.fetchFiltersSuccess({
                filters: filters,
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
        const queries: {
          [key: string]: Observable<ApolloQueryResult<unknown>>;
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
        const params = filterMap.get(action.label);
        if (params) {
          // get current filters list
          // sync query parameters
          if (action.skip) {
            params.parameters['skip'] = action.skip;
          }
          if (action.limit) {
            params.parameters['limit'] = action.limit;
          }
          if (action.term) {
            if (action.term == '') {
              params.parameters['term'] = action.term;
            } else {
              params.parameters['term'] = action.term + '*';
            }
            nextPage = 0;
          }
          if (action.terms) {
            params.parameters['terms'] = action.terms;
            nextPage = 0;
          }

          //update next page parameter (is this needed?)
          if (action.skip && filterMatch?.page >= action.skip / 200) {
            nextPage = filterMatch?.page + 1;
          }
          //send query and params with current filter
          if (params.query) {
            queries[action.label] = filterService.fetchDiseases(
              params.query,
              params.parameters,
            );
          }
        }
        return combineLatest(queries).pipe(
          map((res: { [key: string]: ApolloQueryResult<unknown> }) => {
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
