import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client';
import {
  CoreProject,
  FETCHGRANTDETAILS,
  FETCHPROJECTSQUERY,
  GRANTDETAILSVARIABLES,
  PROJECTVARIABLES,
} from '@ncats-frontend-library/models/rdas';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { filter, map, mergeMap, withLatestFrom } from 'rxjs';
import { GrantService } from '../grant.service';
import {
  FetchProjectActions,
  FetchProjectsListActions,
} from './grants.actions';

export const fetchProject$ = createEffect(
  (actions$ = inject(Actions), projectService = inject(GrantService)) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/grants') &&
          r.payload.routerState.url.startsWith('/grant'),
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams,
      ),
      mergeMap((params: { projectid?: string }) => {
        GRANTDETAILSVARIABLES.coreProjectsWhere.core_project_num =
          params.projectid;
        return projectService
          .fetchProjects(FETCHGRANTDETAILS, GRANTDETAILSVARIABLES)
          .pipe(
            map((projectData: ApolloQueryResult<unknown>) => {
              const data: { coreProjects: CoreProject[] } =
                projectData.data as {
                  coreProjects: CoreProject[];
                };
              if (data) {
                const project: CoreProject = new CoreProject(
                  data.coreProjects[0],
                );
                return FetchProjectActions.fetchProjectSuccess({
                  project: project,
                });
              } else
                return FetchProjectActions.fetchProjectFailure({
                  error: 'No Project found',
                });
            }),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchProjectList$ = createEffect(
  (actions$ = inject(Actions), projectService = inject(GrantService)) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) => {
        return r.payload.routerState.url.startsWith('/disease');
      }),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      mergeMap((root: ActivatedRouteSnapshot) => {
        PROJECTVARIABLES.coreProjectsWhere.projectsUnderCore_SOME.gardsresearchedBy_SOME.GardId =
          root.queryParams['id'];
        if (root.fragment === 'projects') {
          _setProjectsOptions(root.queryParams);
        }
        return projectService
          .fetchProjects(FETCHPROJECTSQUERY, PROJECTVARIABLES)
          .pipe(
            map((projectsData: ApolloQueryResult<unknown>) => {
              const projects: {
                coreProjects: CoreProject[];
                count: { count: number };
              } = projectsData.data as {
                coreProjects: CoreProject[];
                count: { count: number };
              };
              const projectsList = projects.coreProjects.map(
                (proj: Partial<CoreProject>) => new CoreProject(proj),
              );
              const projectCount = projects.count.count;
              const allProjectCount = projects.count.count;
              if (projectsList) {
                return FetchProjectsListActions.fetchProjectsListSuccess({
                  projects: projectsList,
                  projectsCount: projectCount,
                  allProjectsCount: allProjectCount,
                });
              } else
                return FetchProjectsListActions.fetchProjectsListFailure({
                  error: 'No Disease found',
                });
            }),
          );
      }),
    );
  },
  { functional: true },
);

function _setProjectsOptions(options: {
  id?: string;
  limit?: number;
  offset?: number;
}) {
  PROJECTVARIABLES.coreProjectsOptions.limit = <number>options['limit']
    ? <number>options['limit']
    : 10;
  if (<number>options['offset']) {
    PROJECTVARIABLES.coreProjectsOptions.offset = <number>options['offset'] * 1;
  }
}
