import { inject, Injectable } from "@angular/core";
import { ApolloQueryResult } from '@apollo/client';
import {
  CoreProject,
  FETCHGRANTDETAILS,
  GRANTDETAILSVARIABLES
} from "@ncats-frontend-library/models/rdas";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { switchMap, catchError, of, filter, map } from 'rxjs';
import { GrantService } from '../grant.service';
import * as GrantsActions from './grants.actions';

@Injectable()
export class GrantsEffects {
  constructor(private grantService: GrantService) {}

  init$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(GrantsActions.initGrants),
      switchMap(() => of(GrantsActions.loadGrantsSuccess({ grants: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(GrantsActions.loadGrantsFailure({ error }));
      })
    )
  );

  loadGrant$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/grants') &&
          r.payload.routerState.url.startsWith('/grant')
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams
      ),
      switchMap((params: { projectid?: string }) => {
        GRANTDETAILSVARIABLES.coreProjectsWhere.core_project_num =
          params.projectid;
        return this.grantService
          .fetchGrants(FETCHGRANTDETAILS, GRANTDETAILSVARIABLES)
          .pipe(
            map((grantData: ApolloQueryResult<unknown>) => {
              const data: {coreProjects: CoreProject[]} = grantData.data as {coreProjects: CoreProject[]};
              if (data) {
                const grant: CoreProject = new CoreProject(
                  data.coreProjects[0]
                );
                return GrantsActions.fetchGrantSuccess({ grant: grant });
              } else
                return GrantsActions.fetchGrantFailure({
                  error: 'No Disease found',
                });
            })
          );
      })
    )
  );
}
