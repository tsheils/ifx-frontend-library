import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Params } from '@angular/router';
import { DiseaseService } from '@ncats-frontend-library/stores/disease-store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {
  ROUTER_NAVIGATION,
  RouterNavigationAction,
  getRouterSelectors,
} from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { catchError, of, exhaustMap, map, filter, mergeMap, tap } from 'rxjs';
import { IfxToolsService } from '../ifx-tools.service';
import { FetchToolActions, LoadToolsActions } from './ifx-tools.actions';
import { Tool } from 'ifx';

export const loadData = createEffect(
  (actions$ = inject(Actions), ifxToolsService = inject(IfxToolsService)) => {
    return actions$.pipe(
      ofType(LoadToolsActions.loadTools),
      exhaustMap(() => {
        return ifxToolsService.fetchData().pipe(
          map(
            (data: unknown[]) => {
              const retData: Tool[] = data.map(
                (obj) => new Tool(obj as Partial<Tool>),
              );
              const tempAudience: string[] = [];
              retData.forEach((tool) => {
                if (tool.audience && tool.audience.length) {
                  tempAudience.push(
                    ...tool.audience.split('|').map((val) => val.trim()),
                  );
                }
              });
              const retAudience: string[] = Array.from(new Set(tempAudience));
              const tempCategory: string[] = [];
              retData.forEach((tool) => {
                if (tool.category && tool.category.length) {
                  tempCategory.push(
                    ...tool.category.split('|').map((val) => val.trim()),
                  );
                }
              });
              const retCategory: string[] = Array.from(new Set(tempCategory));
              return LoadToolsActions.loadToolsSuccess({
                tools: retData,
                audienceList: retAudience,
                categoryList: retCategory,
              });
            },
            catchError((error: ErrorEvent) =>
              of(LoadToolsActions.loadToolsFailure({ error: error.message })),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchTool = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) =>
        r.payload.routerState.url.includes('/toolbox'),
      ),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      mergeMap((root: ActivatedRouteSnapshot) => {
        const params = root.firstChild?.url[1].path;
        if (params) {
          return of(FetchToolActions.setSelectedID({ id: params }));
        } else {
          return of(FetchToolActions.fetchToolFailure({ error: 'no tool' }));
        }
      }),
    );
  },
  { functional: true },
);
