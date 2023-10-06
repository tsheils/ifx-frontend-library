import { Injectable } from '@angular/core';
import { Params } from "@angular/router";
import {
  GENEFILTERPARAMETERS,
  GENEFILTERS,
  PHENOTYPEFILTERPARAMETERS,
  PHENOTYPEFILTERS

} from "@ncats-frontend-library/models/rdas";
import { Filter, FilterCategory } from "@ncats-frontend-library/models/utils";
import { createEffect, Actions, ofType, concatLatestFrom } from "@ngrx/effects";
import { ROUTER_NAVIGATION, RouterNavigationAction } from "@ngrx/router-store";
import { Store } from "@ngrx/store";
import { switchMap, filter, map, forkJoin, combineLatest } from "rxjs";
import { FilterService } from "../filter.service";
import * as FiltersActions from './filters.actions';
import * as FiltersFeature from './filters.reducer';
import * as FiltersSelectors from './filters.selectors';

export const filterMap: Map<string, any> = new Map<string, any>([
['phenotypes', {
 query: PHENOTYPEFILTERS,
  parameters: PHENOTYPEFILTERPARAMETERS
}],
['genes', {
  query: GENEFILTERS,
  parameters: GENEFILTERPARAMETERS
}]
])


@Injectable()
export class FiltersEffects {
  /**
   * initial load and paging of filter list
   */
  loadFilters$ = createEffect((): any => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) => r.payload.routerState.url.startsWith('/diseases')),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      switchMap((params:Params) => {
        const queries: any = {};
          [...filterMap.keys()].forEach((selectedFilter: string | undefined) => {
            if (selectedFilter != null) {
              const queryParams = filterMap.get(selectedFilter);
              if (params[selectedFilter]) {
                queryParams.parameters.terms = params[selectedFilter].split("&");
              }
              else {
                queryParams.parameters.terms = [];
              }
              queries[selectedFilter] = this.filterService.fetchDiseases(queryParams.query, queryParams.parameters)
            }
          });
        return combineLatest(queries)
          .pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((res: any) => {
              if(res) {
                const filters = this.parseFilterResponse(res)
                return FiltersActions.fetchFiltersSuccess({ filters: filters })
              } else {
                return FiltersActions.fetchFiltersFailure({ error: "No Disease found" })
              }
            }))

      }))
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchFilters$ = createEffect((): any => {
    return this.actions$.pipe(
      ofType(FiltersActions.fetchFilters),
      concatLatestFrom(() => this.store.select(FiltersSelectors.selectAllFilters)),
      switchMap(([action, currentFilters]) => {
        const queries: any = {};
        let nextPage = 1;
        //map previous filters to sync later
        const currentFiltersMap: Map<string, FilterCategory> = new Map<string, FilterCategory>();
        currentFilters.forEach(filter => currentFiltersMap.set(filter.label, filter));

        //get current searched/paged/selected filter, mainly for the current values
        let filterMatch: FilterCategory | undefined = currentFiltersMap.get(action.label)
        if(!filterMatch){
          filterMatch = new FilterCategory({ values:[], page: 2, label: action.label});
        }
        //get queries and parameters
        const params = filterMap.get(action.label);
        // get current filters list
          // sync query parameters
          if (action.skip) {
            params.parameters.skip = action.skip;
          }
          if (action.limit) {
            params.parameters.limit = action.limit;
          }
          if (action.term) {
            if (action.term == "") {
              params.parameters.term = action.term;
            } else {
              params.parameters.term = action.term + "*";
            }
            nextPage = 0;
          }
          if (action.terms) {
            params.parameters.terms = action.terms;
            nextPage = 0;
          }

         //update next page parameter (is this needed?)
          if (action.skip && (filterMatch?.page >= action.skip / 200)) {
            nextPage = filterMatch?.page + 1;
          }
          //send query and params with current filter
          queries[action.label] = this.filterService.fetchDiseases(params.query, params.parameters)


     //   return this.filterService.fetchDiseases(PHENOTYPEFILTERS, PHENOTYPEFILTERPARAMETERS)
    //      .pipe(
        return combineLatest(queries)
          .pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((res: any) => {
              if(res) {
              const tempFilter = new FilterCategory({...filterMatch, page: nextPage, query: action.term})

              const filter = this.parseFilterResponse(res, tempFilter);
                return FiltersActions.fetchFiltersSuccess({filters: filter})
              }
              else return FiltersActions.fetchFiltersFailure({error: "No Disease found"})
            })
          )
      })
    )}
  );

  private parseFilterResponse(res: any, currentFilter?: FilterCategory): FilterCategory[] {
    const filters: FilterCategory[] = [];
    Object.keys(res).forEach(key => {

      //selected/checked filters always go on top
      const retMap: Map<string, Filter> = new Map<string, Filter>();
      res[key].data.selectedFilters.forEach((obj: Partial<Filter>) => {
        retMap.set(<string>obj.term, new Filter({
          ...obj,
          selected: true
        }));
      })

      //search term
      res[key].data.searchFilters.forEach((obj: Partial<Filter>) => {
        if(!retMap.has(<string>obj.term)) {
          retMap.set(<string>obj.term, new Filter({
            ...obj,
          }));
        }
      })
      //current values (just for pagination)
      currentFilter?.values.forEach(filter => {
          if(!retMap.has(filter.term)){
            retMap.set(filter.term, filter)
          }
        }
      )

      //everything else
      res[key].data.allFilters.forEach((obj: Partial<Filter>) => {
        if(!retMap.has(<string>obj.term)) {
          retMap.set(<string>obj.term, new Filter({
            ...obj,
          }));
        }
      })
      const filterCategory: FilterCategory = new FilterCategory({
        label: key,
        values: [...retMap.values()],
        page: currentFilter?.page,
        query: currentFilter?.query
      })
      filters.push(filterCategory)
    })
    return filters
  }

  constructor(
    private readonly actions$: Actions,
    private filterService: FilterService,
    private store: Store
  ) {}
}
