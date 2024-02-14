import { inject } from "@angular/core";
import { ApolloQueryResult } from '@apollo/client';
import {
  CoreProject,
  FETCHGRANTDETAILS,
  GRANTDETAILSVARIABLES
} from "@ncats-frontend-library/models/rdas";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { filter, map, mergeMap } from "rxjs";
import { GrantService } from '../grant.service';
import { FetchGrantActions } from "./grants.actions";


export const loadGrant$ = createEffect(
  (
    actions$ = inject(Actions),
    grantService = inject(GrantService)
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/grants') &&
          r.payload.routerState.url.startsWith('/grant')
      ),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      mergeMap((params: { projectid?: string }) => {
        GRANTDETAILSVARIABLES.coreProjectsWhere.core_project_num =
          params.projectid;
        return grantService
          .fetchGrants(FETCHGRANTDETAILS, GRANTDETAILSVARIABLES)
          .pipe(
            map((grantData: ApolloQueryResult<unknown>) => {
              const data: { coreProjects: CoreProject[] } = grantData.data as { coreProjects: CoreProject[] };
              if (data) {
                const grant: CoreProject = new CoreProject(
                  data.coreProjects[0]
                );
                return FetchGrantActions.fetchGrantSuccess({ grant: grant });
              } else
                return FetchGrantActions.fetchGrantFailure({
                  error: 'No Project found',
                });
            })
          );
      })
    )
  }, {functional: true}
  )

