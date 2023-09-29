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
import { switchMap, filter, map } from "rxjs";
import { FilterService } from "../filter.service";
import * as FiltersActions from './filters.actions';
import * as FiltersFeature from './filters.reducer';
import * as FiltersSelectors from './filters.selectors';

const filterMap: Map<string, any> = new Map<string, any>([
['phenotypes', {
 query: PHENOTYPEFILTERS,
  parameters: PHENOTYPEFILTERPARAMETERS
}],
['genes', {
  query: GENEFILTERS,
  parameters: GENEFILTERPARAMETERS

}],

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
      switchMap((params: Params) => {
        //todo: iterate over each parameter and fetch each query from a map
        const paramsList = Object.keys(params).filter(key => !['sort', 'pageIndex', 'pageSize', 'direction'].includes(key))
        const selectedFilters: string | undefined = params[paramsList[0]];
        if (selectedFilters && selectedFilters.length) {
          PHENOTYPEFILTERPARAMETERS.terms = selectedFilters.split("&");
        }
          return this.filterService.fetchDiseases(PHENOTYPEFILTERS, PHENOTYPEFILTERPARAMETERS )
          .pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((res: any) => {
              if(res && res.data) {
                const retMap: Map<string, Filter> = new Map<string, Filter>();
                res.data.selectedFilters.forEach((obj: Partial<Filter>) => {
                  retMap.set(<string>obj.term, new Filter({
                    ...obj,
                    selected: !!selectedFilters && selectedFilters.includes(<string>obj.term)
                  }));
                })

                  res.data.allFilters.forEach((obj: Partial<Filter>) => {
                    if(!retMap.has(<string>obj.term)) {
                      retMap.set(<string>obj.term, new Filter({
                        ...obj,
                      }));
                    }
                  })

                const filterCategory: FilterCategory = new FilterCategory({
                  label: 'phenotypes',
                  values: [...retMap.values()] })
                return FiltersActions.fetchFiltersSuccess({ filters: [filterCategory] })
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
        let nextPage = 1;
        let filterMatch: FilterCategory = new FilterCategory({ values:[], page: 2, label:''});
        if(currentFilters && currentFilters.filter(filter => filter.label === action.label).length) {
            filterMatch = currentFilters.filter(filter => filter.label === action.label)[0]

            if (action.skip && (filterMatch.page >= action.skip / 200)) {
              nextPage = filterMatch.page + 1;
            }
        }
        if(action.skip) {
          PHENOTYPEFILTERPARAMETERS.skip = action.skip;
        }
        if(action.limit) {
          PHENOTYPEFILTERPARAMETERS.limit = action.limit;
        }
        if(action.term ) {
        if (action.term === '') {
          PHENOTYPEFILTERPARAMETERS.term = '';
        } else {
          PHENOTYPEFILTERPARAMETERS.term = action.term + '*';
        }
          nextPage = 0;
        }
        if(action.terms) {
          PHENOTYPEFILTERPARAMETERS.terms = action.terms;
          nextPage = 0;
        }
        return this.filterService.fetchDiseases(PHENOTYPEFILTERS, PHENOTYPEFILTERPARAMETERS)
          .pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((res: any) => {
              if(res && res.data) {
                /*
                start with selected fields
                add searched fields, removing duplicates, favoring selected fields
                add all fields, remove duplicates, favor selected
                 */
                const retMap: Map<string, Filter> = new Map<string, Filter>();
                res.data.selectedFilters.forEach((obj: Partial<Filter>) => {
                  retMap.set(<string>obj.term, new Filter({
                    ...obj,
                    selected: true
                  }));
                })

                if((res.data.searchFilters && res.data.searchFilters.length) && action.term) {
                  res.data.searchFilters.forEach((obj: Partial<Filter>) => {
                    if(!retMap.has(<string>obj.term)) {
                      retMap.set(<string>obj.term, new Filter({
                        ...obj,
                      }));
                    }
                  })
                } else {
                  filterMatch.values.forEach(filter => {
                    if(!retMap.has(filter.term)){
                      retMap.set(filter.term, filter)
                    }
                    }
                  )
                  res.data.allFilters.forEach((obj: Partial<Filter>) => {
                    if(!retMap.has(<string>obj.term)) {
                      retMap.set(<string>obj.term, new Filter({
                        ...obj,
                      }));
                    }
                  })
                }
                const phenotypeCategory: FilterCategory = new FilterCategory({
                  label: action.label,
                  query: action.term,
                  values: [...retMap.values()], page: nextPage})
                return FiltersActions.fetchFiltersSuccess({filters: [phenotypeCategory]})
              }
              else return FiltersActions.fetchFiltersFailure({error: "No Disease found"})
            })
          )
      })
    )}
  );

  constructor(
    private readonly actions$: Actions,
    private filterService: FilterService,
    private store: Store
  ) {}
}
