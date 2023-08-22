import { Injectable, inject } from '@angular/core';
import {
  Article,
  ARTICLEDETAILSVARIABLES,
  CoreProject,
  FETCHARTICLEDETAILS, FETCHGRANTDETAILS, GRANTDETAILSVARIABLES
} from "@ncats-frontend-library/models/rdas";
import { ArticleService } from "@ncats-frontend-library/stores/article-store";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from "@ngrx/router-store";
import { Store } from "@ngrx/store";
import { switchMap, catchError, of, filter, map } from "rxjs";
import { GrantService } from "../grant.service";
import * as GrantsActions from './grants.actions';
import * as GrantsFeature from './grants.reducer';

@Injectable()
export class GrantsEffects {

  constructor(
    private actions$: Actions,
    private grantService: GrantService,
    private store: Store
  ) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GrantsActions.initGrants),
      switchMap(() => of(GrantsActions.loadGrantsSuccess({ grants: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(GrantsActions.loadGrantsFailure({ error }));
      })
    )
  );

  loadGrant$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) => !r.payload.routerState.url.includes('/grants') && r.payload.routerState.url.startsWith('/grant')),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      switchMap((params: {projectid?: string}) => {
        GRANTDETAILSVARIABLES.coreProjectsWhere.core_project_num =  params.projectid;
        return this.grantService.fetchGrants(FETCHGRANTDETAILS, GRANTDETAILSVARIABLES)
          .pipe(
            map((grantData: any) => {
              console.log(grantData);
              if (grantData.data) {
                const grant: CoreProject = new CoreProject(grantData.data.coreProjects[0]);
                console.log(grant);
                return GrantsActions.fetchGrantSuccess({ grant: grant });
              } else return GrantsActions.fetchGrantFailure({ error: "No Disease found" });
            })
          );
      })
    )}
  );

}
