import { inject } from '@angular/core';
import { Params } from '@angular/router';
import { ObservableQuery } from '@apollo/client';
import {
  CoreProject,
  CoreProjectListQueryGQL,
  CoreProjectQueryGQL,
  ProjectQueryFactory,
} from 'rdas-models';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { filter, map, mergeMap, switchMap } from 'rxjs';
import {
  FetchProjectActions,
  FetchProjectsListActions,
} from './projects.actions';
import { DiseaseSelectors } from 'disease-store';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';

const queryFactory = new ProjectQueryFactory();

interface ProjectQueryResponse {
  diseases: {
    countProjects: number;
    countCoreProjects: number;
    coreProjects: CoreProject[];
    totalCount: {
      totalCount: number;
    };
  }[];
}

export const loadCoreProjectsList$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    coreProjectListQuery = inject(CoreProjectListQueryGQL),
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      concatLatestFrom(() => store.select(DiseaseSelectors.getSelected)),
      filter(([r, data]) => {
        return (
          !r.payload.routerState.url.includes('/diseases') &&
          r.payload.routerState.url.includes('/disease') &&
          (!data || r.payload.routerState.root.fragment === 'projects')
        );
      }),
      map(([r]) => {
        return r.payload.routerState.root.queryParams;
      }),
      switchMap((params: Params) => {
        const query = queryFactory.getQuery(params);
        return coreProjectListQuery
          .watch({ variables: query.params })
          .valueChanges.pipe(
            map((res: ObservableQuery.Result<unknown>) => {
              if (res && res.data) {
                const data = (res.data as ProjectQueryResponse).diseases[0];
                const coreProjectsList = data.coreProjects.map(
                  (project: Partial<CoreProject>) =>
                    new CoreProject({
                      ...project,
                      subProjectsCount: project._subProjectsCount!.totalCount,
                    }),
                );
                return FetchProjectsListActions.fetchProjectsListSuccess({
                  projects: coreProjectsList,
                  projectsCount: data.countCoreProjects,
                  allProjectsCount: data.countCoreProjects,
                });
              } else
                return FetchProjectsListActions.fetchProjectsListFailure({
                  error: 'No projects found',
                });
            }),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchProject$ = createEffect(
  (
    actions$ = inject(Actions),
    coreProjectQuery = inject(CoreProjectQueryGQL),
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/projects') &&
          r.payload.routerState.url.startsWith('/project'),
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams,
      ),
      mergeMap((params) => {
        const query = queryFactory.getQuery(params);
        return coreProjectQuery
          .watch({ variables: query.params })
          .valueChanges.pipe(
            map((projectData: ObservableQuery.Result<unknown>) => {
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
