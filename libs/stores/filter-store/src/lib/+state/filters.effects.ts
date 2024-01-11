import { inject, Injectable } from "@angular/core";
import { Params } from '@angular/router';
import { ApolloQueryResult, DocumentNode } from "@apollo/client";
import {
  GENEFILTERPARAMETERS,
  GENEFILTERS,
  PHENOTYPEFILTERPARAMETERS,
  PHENOTYPEFILTERS
} from "@ncats-frontend-library/models/rdas";
import { Filter, FilterCategory } from '@ncats-frontend-library/models/utils';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { switchMap, filter, map, combineLatest, ObservableInput, Observable } from "rxjs";
import { FilterService } from '../filter.service';
import * as FiltersActions from './filters.actions';
import * as FiltersSelectors from './filters.selectors';

export interface FilterResponse {
  [key: string]: {
    data: {
      allFilters: Filter[],
      searchFilters: [],
      selectedFilters: []
      }
  }
}

export const filterMap: Map<string, {query: DocumentNode, parameters: { [key: string]: unknown}}> = new Map<string, {query: DocumentNode, parameters: { [key: string]: unknown}} >([
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

@Injectable()
export class FiltersEffects {
  /**
   * initial load and paging of filter list
   */
  loadFilters$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) =>
        r.payload.routerState.url.startsWith('/diseases')
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams
      ),
      switchMap((params: Params) => {
        const queries: {[key: string]: ObservableInput<unknown>} = {};
        [...filterMap.keys()].forEach((selectedFilter: string | undefined) => {
          if (selectedFilter != null) {
            const queryParams = filterMap.get(selectedFilter);
            if (queryParams) {
              if (params[selectedFilter]) {
                queryParams.parameters['terms'] = params[selectedFilter].split('&');
              } else {
                queryParams.parameters['terms'] = [];
              }
              queries[selectedFilter] = this.filterService.fetchDiseases(
                queryParams.query,
                queryParams.parameters
              );
            }
          }
        });
        return combineLatest(queries).pipe(
          map((res: unknown) => {
            const data = res as FilterResponse;
            if (data) {
              const filters = this.parseFilterResponse(data);
              return FiltersActions.fetchFiltersSuccess({ filters: filters });
            } else {
              return FiltersActions.fetchFiltersFailure({
                error: 'No Disease found',
              });
            }
          })
        );
      })
    )
  );

  searchFilters$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(FiltersActions.fetchFilters),
      concatLatestFrom(() =>
        this.store.select(FiltersSelectors.selectAllFilters)
      ),
      switchMap(([action, currentFilters]) => {
        const queries: {[key:string]: Observable<ApolloQueryResult<unknown>>} = {};
        let nextPage = 1;
        //map previous filters to sync later
        const currentFiltersMap: Map<string, FilterCategory> = new Map<
          string,
          FilterCategory
        >();
        currentFilters.forEach((filter) =>
          currentFiltersMap.set(filter.label, filter)
        );

        //get current searched/paged/selected filter, mainly for the current values
        let filterMatch: FilterCategory | undefined = currentFiltersMap.get(
          action.label
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
        if(params) {
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
            queries[action.label] = this.filterService.fetchDiseases(
              params.query,
              params.parameters
            );
          }
        }
        return combineLatest(queries).pipe(
          map((res: {[key:string]: ApolloQueryResult<unknown>}) => {
            console.log(res)
            if (res) {
              const tempFilter = new FilterCategory({
                ...filterMatch,
                page: nextPage,
                query: action.term,
              });

              const filter = this.parseFilterResponse(res as FilterResponse, tempFilter);
              return FiltersActions.fetchFiltersSuccess({ filters: filter });
            } else
              return FiltersActions.fetchFiltersFailure({
                error: 'No Disease found',
              });
          })
        );
      })
    )
  );


  private parseFilterResponse(
    res: FilterResponse,
    currentFilter?: FilterCategory
  ): FilterCategory[] {
    const filters: FilterCategory[] = [];
    if(Object.keys(res).length) {
      Object.keys(res).forEach((key: string) => {
        const retMap: Map<string, Filter> = new Map<string, Filter>();
        const selectedFiltersData: { selectedFilters: Filter[] } = res[key as keyof FilterResponse].data as { selectedFilters: Filter[] };
        if (selectedFiltersData) {
          //selected/checked filters always go on top
          selectedFiltersData.selectedFilters.forEach((obj: Partial<Filter>) => {
            retMap.set(
              <string>obj.term,
              new Filter({
                ...obj,
                selected: true,
              })
            );
          });
        }
        //search term
        const searchFiltersData: { searchFilters: Filter[] } = res[key].data as { searchFilters: Filter[] };
        if (searchFiltersData) {
          searchFiltersData.searchFilters.forEach((obj: Partial<Filter>) => {
            if (!retMap.has(<string>obj.term)) {
              retMap.set(
                <string>obj.term,
                new Filter({
                  ...obj,
                })
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
        const allFiltersData: { allFilters: Filter[] } = res[key].data as { allFilters: Filter[] };
        if (allFiltersData) {
          allFiltersData.allFilters.forEach((obj: Partial<Filter>) => {
            if (!retMap.has(<string>obj.term)) {
              retMap.set(
                <string>obj.term,
                new Filter({
                  ...obj,
                })
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

  constructor(
    private readonly actions$: Actions,
    private filterService: FilterService,
    private store: Store
  ) {}
}
