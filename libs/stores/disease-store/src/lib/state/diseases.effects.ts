import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Params } from '@angular/router';
import { ObservableQuery } from '@apollo/client';
import {
  Disease, DiseaseDynamicFiltersQueryGQL,
  DiseaseListQueryGQL,
  DiseaseNode,
  DiseaseQueryFactory, DiseaseQueryGQL, DiseaseStaticFiltersQueryGQL, DiseasesTypeaheadGQL,
  DISEASETYPEAHEAD,
} from 'rdas-models';
import { Filter, FilterCategory, Page } from 'utils-models';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import {
  filter,
  map,
  mergeMap,
  switchMap,
} from 'rxjs';
import {
  BrowseDiseaseListActions,
  FetchDiseaseActions,
  FetchDiseaseListActions,
  SearchDiseasesActions,
} from './diseases.actions';

const queryFactory = new DiseaseQueryFactory();

class DiseaseFilterResponse {
 [key: string]: Filter[];
}

//for disease list browsing
export const fetchDiseasesList$ = createEffect(
  (
    actions$ = inject(Actions),
    diseaseListQuery = inject(DiseaseListQueryGQL),
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) =>
        r.payload.routerState.url.startsWith('/diseases'),
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams,
      ),
      switchMap((params: Params) => {
        const query = queryFactory.getQuery(params);
        return diseaseListQuery.watch({variables: query.params}).valueChanges
          .pipe(
          map((res: ObservableQuery.Result<unknown>) => {
            const data: {
              diseases: Disease[];
              total: { count: number } | number;
            } = res.data as {
              diseases: Disease[];
              total: { count: number } | number;
            };
            if (data) {
              const diseaseArr: Disease[] = data.diseases.map(
                (obj: Partial<Disease>) => new Disease(obj),
              );
              console.log(diseaseArr);
              return BrowseDiseaseListActions.fetchDiseaseListSuccess({
                diseases: diseaseArr,
                page: _makePage(params, data.total),
              });
            } else
              return BrowseDiseaseListActions.fetchDiseaseListFailure({
                error: 'No Disease found',
              });
          }),
        );
      }),
    );
  },
  { functional: true },
);

//for disease list in profile
export const fetchDiseaseListFromIds$ = createEffect(
  (actions$ = inject(Actions), diseaseListQuery = inject(DiseaseListQueryGQL)) => {
    return actions$.pipe(
      ofType(FetchDiseaseListActions.fetchDiseaseList),
      mergeMap((action: { gardIds: string[] }) => {
        const query = queryFactory.getQuery(action);
        return diseaseListQuery.watch({ variables: query.params }).valueChanges
          .pipe(
          map((res: ObservableQuery.Result<unknown>) => {
            const data: { diseases: DiseaseNode[] } = res.data as {
              diseases: DiseaseNode[];
            };
            if (data) {
              const diseaseArr: Disease[] = data.diseases.map(
                (obj: Partial<Disease>) => new Disease(obj),
              );
              return FetchDiseaseListActions.fetchDiseaseListSuccess({
                diseases: diseaseArr,
              });
            } else
              return FetchDiseaseListActions.fetchDiseaseListFailure({
                error: 'No Disease found',
              });
          }),
        );
      }),
    );
  },
  { functional: true },
);

//disease search typeahead
export const searchDiseases$ = createEffect(
  (
    actions$ = inject(Actions),
    diseaseTypeaheadQuery = inject(DiseasesTypeaheadGQL),
  ) => {
    return actions$.pipe(
      ofType(SearchDiseasesActions.searchDiseases),
      mergeMap((action: { term: string }) => {
        return diseaseTypeaheadQuery
          .watch({
            variables: {
              searchString: action.term, //.split(' ').join('~ AND ') + '*',
              limit: 10,
            },
          })
          .valueChanges.pipe(
            map((res: ObservableQuery.Result<unknown>) => {
              console.log(res);
              const data: { diseaseSearch: Disease[] } = res.data as {
                diseaseSearch: Disease[];
              };
              if (data) {
                const diseaseArr = data.diseaseSearch.map(
                  (obj: Partial<Disease>) => new Disease(obj),
                );
                console.log(diseaseArr);
                return SearchDiseasesActions.searchDiseasesSuccess({
                  typeahead: diseaseArr,
                });
              } else
                return SearchDiseasesActions.searchDiseasesFailure({
                  error: 'No Diseases found',
                });
            }),
          );
      }),
    );
  },
  { functional: true },
);


//specific disease page
export const loadDisease$ = createEffect(
  (actions$ = inject(Actions), diseaseQuery = inject(DiseaseQueryGQL)) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/diseases') &&
          r.payload.routerState.url.startsWith('/disease'),
      ),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      mergeMap((root: ActivatedRouteSnapshot) => {
        const params = root.queryParams;
        const query = queryFactory.getQuery(params);
        return diseaseQuery
          .watch({ variables: query.params }).valueChanges
          .pipe(
            map((res: ObservableQuery.Result<unknown>) => {
              const data: {
                diseases: Disease[];
              } = res.data as {
                diseases: Disease[];
              };
              if (data) {
                const diseaseArr: Disease[] = data.diseases.map(
                  (obj: Partial<Disease>) => new Disease(obj),
                );
                return FetchDiseaseActions.fetchDiseaseSuccess({
                  disease: diseaseArr[0],
                });
              } else
                return FetchDiseaseActions.fetchDiseaseFailure({
                  error: 'No Disease found',
                });
            }),
          );
      }),
    );
  },
  { functional: true },
);


// bar and pie charts
export const loadStaticDiseaseFilters$ = createEffect(
  (
    actions$ = inject(Actions),
    staticFiltersQuery = inject(DiseaseStaticFiltersQueryGQL),
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/diseases') &&
          r.payload.routerState.url.startsWith('/disease'),
      ),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      mergeMap((root: ActivatedRouteSnapshot) => {
        const params = root.queryParams;
        const query = queryFactory.getStaticFilterQuery(params);
        return staticFiltersQuery.watch({variables: query.params}).valueChanges
          .pipe(
            map((res: ObservableQuery.Result<unknown>) => {
              console.log(res);
              const data: {
                diseases: Disease[];
              } = res.data as {
                diseases: Disease[];
              };
              if (data) {
                const diseaseArr: Disease[] = data.diseases.map(
                  (obj: Partial<Disease>) => new Disease(obj),
                );

                //  const data = res.data as DiseaseFilterResponse;
                // if(data) {
                const filters = _parseFilters(
                  diseaseArr[0].filterCounts as DiseaseFilterResponse,
                );
                return FetchDiseaseActions.fetchStaticDiseaseFiltersSuccess({
                  filters: filters,
                });
              } else
                return FetchDiseaseActions.fetchStaticDiseaseFiltersFailure({
                  error: 'No Disease found',
                });
            }),
          );
      }),
    );
  },
  { functional: true },
);

export const loadDynamicDiseaseFilters$ = createEffect(
  (
    actions$ = inject(Actions),
    dynamicFiltersQuery = inject(DiseaseDynamicFiltersQueryGQL),
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/diseases') &&
          r.payload.routerState.url.startsWith('/disease'),
      ),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      mergeMap((root: ActivatedRouteSnapshot) => {
        const params = root.queryParams;
        const query = queryFactory.getDynamicFilterQuery(params);
        return dynamicFiltersQuery.watch({variables: query.params}).valueChanges
          .pipe(
            map((res: ObservableQuery.Result<unknown>) => {
              const data = res.data as DiseaseFilterResponse;
              if (data) {
                const filters = _parseFilters(data, params);
                return FetchDiseaseActions.fetchDiseaseFiltersSuccess({
                  filters: filters,
                });
              } else
                return FetchDiseaseActions.fetchDiseaseFiltersFailure({
                  error: 'No Disease found',
                });
            }),
          );
      }),
    );
  },
  { functional: true },
);


function _parseFilters(data: DiseaseFilterResponse, params?: Params) {
  const filters: FilterCategory[] = []
  Object.entries(data).map((key) => {
    switch (key[0]) {
      case 'diseaseArticleByYear': {
        filters.push(
          new FilterCategory({
            parent: 'articles',
            label: 'Articles by Year',
            field: 'year',
            values: key[1].map(
              (fil: Partial<Filter>) =>
                new Filter({
                  ...fil,
                 /* selected:
                    params['OverallStatus'] === fil.term ||
                    params['OverallStatus']?.includes(fil.term),*/
                }),
            ),
          }),
        );
        break;
      }
      case 'diseaseArticleByEpi': {
        filters.push(
          new FilterCategory({
            parent: 'articles',
            label: 'Epidemiology Articles ',
            field: 'isEpi',
            values: key[1].map(
              (fil: Partial<Filter>) => new Filter({ ...fil, label: 'isEpi' }),
            ),
          }),
        );
        break;
      }
      case 'diseaseArticleByNHS': {
        filters.push(
          new FilterCategory({
            parent: 'articles',
            label: 'Natural Health Study Articles',
            field: 'isNHS',
            values: key[1].map(
              (fil: Partial<Filter>) => new Filter({ ...fil, label: 'isNHS' }),
            ),
          }),
        );
        break;
      }
      case 'diseaseProjectsByYear': {
        filters.push(
          new FilterCategory({
            parent: 'projects',
            label: 'Projects Count by Year',
            filterable: false,
            values: key[1].map((fil: Partial<Filter>) => new Filter(fil)),
          }),
        );
        break;
      }
      case 'diseaseProjectsByCost': {
        filters.push(
          new FilterCategory({
            parent: 'projects',
            label: 'Projects Funding by Year',
            filterable: false,
            values: key[1].map((fil: Partial<Filter>) => new Filter(fil)),
          }),
        );
        break;
      }
      case 'trialCountsByPhase':
      case 'diseaseTrialsByPhase': {
        filters.push(
          new FilterCategory({
            parent: 'trials',
            label: 'Clinical Trials by Phase',
            field: 'phase',
            values: key[1].map(
              (fil: Partial<Filter>) => {
                let filter: Filter;
                if(params){
                filter = new Filter({
                  ...fil,
                  selected:
                    params['phase'] === fil.term ||
                    params['phase']?.includes(fil.term),
                })
                  } else {
                filter = new Filter(fil)
              }
                return filter
          })
        })
        )
        break;
      }
      case 'trialCountsByStatus':
      case 'diseaseTrialsByStatus': {
        filters.push(
          new FilterCategory({
            parent: 'trials',
            label: 'Clinical Trials by Status',
            field: 'overallStatus',
            values: key[1].map((fil: Partial<Filter>) => {
              let filter: Filter;
              if (params) {
                filter = new Filter({
                  ...fil,
                  selected:
                    params['overallStatus'] === fil.term ||
                    params['overallStatus']?.includes(fil.term),
                });
              } else {
                filter = new Filter(fil);
              }
              return filter;
            }),
          }),
        );
        break;
      }
      case 'trialCountsByType':
      case 'diseaseTrialsByType':
        {
          filters.push(
            new FilterCategory({
              parent: 'trials',
              label: 'Clinical Trials by Type',
              field: 'studyType',
              values: key[1].map(
                (fil: Partial<Filter>) => {
                  let filter: Filter;
                  if(params){
                    filter = new Filter({
                      ...fil,
                      selected:
                        params['studyType'] === fil.term ||
                        params['studyType']?.includes(fil.term),
                    })
                  } else {
                    filter = new Filter(fil)
                  }
                  return filter
                })
            })
          )
        break;
    }
    }
    })
    return filters
}

/*
//dynamic paged filters list
export const loadDiseaseFilters$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    diseaseService = inject(DiseaseService),
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) => {
        return (
          !r.payload.routerState.url.includes('/diseases') &&
          r.payload.routerState.url.startsWith('/disease') &&
          !r.payload.routerState.root.queryParams['offset']
        );
      }),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      concatLatestFrom(() =>
        store.select(DiseaseSelectors.getStaticDiseaseFilters),
      ),
      mergeMap(([root, staticFilters]) => {
        const params: Params = root.queryParams;
        const gardid: string = params['id'];
        return combineLatest(
          diseaseService
            .fetchArticles(ARTICLEFILTERS, { gardId: gardid })
            .pipe(take(1)),
          diseaseService
            .fetchProjects(PROJECTFILTERS, { gardId: gardid })
            .pipe(take(1)),
          diseaseService
            .fetchTrials(TRIALTYPEFILTERS, _setTrialVariables(params, 'type'))
            .pipe(take(1)),
          diseaseService
            .fetchTrials(
              TRIALSTATUSFILTERS,
              _setTrialVariables(params, 'status'),
            )
            .pipe(take(1)),
          diseaseService
            .fetchTrials(TRIALPHASEFILTERS, _setTrialVariables(params, 'phase'))
            .pipe(take(1)),
        ).pipe(
          map(
            ([
              articleFilterData,
              projectFilterData,
              trialTypeFilterData,
              trialStatusFilterData,
              trialPhaseFilterData,
            ]: [
              ObservableQuery.Result<unknown>,
              ObservableQuery.Result<unknown>,
              ObservableQuery.Result<unknown>,
              ObservableQuery.Result<unknown>,
              ObservableQuery.Result<unknown>,
            ]) => {
              if (
                articleFilterData ||
                projectFilterData ||
                trialTypeFilterData ||
                trialStatusFilterData ||
                trialPhaseFilterData
              ) {
                const typeData = trialTypeFilterData as {
                  data: { trialsByType: Filter[] };
                };
                const statusData = trialStatusFilterData as {
                  data: { trialsByStatus: Filter[] };
                };
                const phaseData = trialPhaseFilterData as {
                  data: { trialsByPhase: Filter[] };
                };
                const trialFilterData = {
                  data: {
                    allClinicalTrialsFilters: {
                      trialsByStatus: statusData.data.trialsByStatus,
                      trialsByType: typeData.data.trialsByType,
                      trialsByPhase: phaseData.data.trialsByPhase,
                    },
                  },
                } as ObservableQuery.Result<unknown>;
                const filters = _parseFilterResponse(
                  articleFilterData,
                  projectFilterData,
                  trialFilterData,
                  params,
                );
                if (root.fragment) {
                  filters.forEach((filter) => {
                    if (filter.parent === root.fragment) {
                      if (filter.field) {
                        filter.values.map((val) => {
                          if (Array.isArray(params[filter.field])) {
                            params[filter.field].forEach((filter: string) => {
                              if (val.term === filter) {
                                val.selected = true;
                              }
                            });
                          } else {
                            if (val.term === params[filter.field]) {
                              val.selected = true;
                            }
                          }
                          return val;
                        });
                      }
                    }
                  });
                }
                return FetchDiseaseActions.fetchDiseaseFiltersSuccess({
                  filters: filters,
                });
              } else
                return FetchDiseaseActions.fetchDiseaseFiltersFailure({
                  error: 'No Disease found',
                });
            },
          ),
        );
      }),
    );
  },
  { functional: true },
);



*/

/*
//load values for first level of hierarchy tree
export const fetchTreeParent$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    diseaseService = inject(DiseaseService),
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) =>
        r.payload.routerState.url.startsWith('/diseases'),
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams,
      ),
      concatLatestFrom(() => store.select(DiseaseSelectors.getDiseaseTree)),
      mergeMap(([params, tree]) => {
        return diseaseService.fetchDiseases(FETCHROOT, {}).pipe(
          map((res: ObservableQuery.Result<unknown>) => {
            const data: {
              treeBranch: { nodes: DiseaseNode[] }[];
              diseases: DiseaseNode[];
            } = res.data as {
              treeBranch: { nodes: DiseaseNode[] }[];
              diseases: DiseaseNode[];
            };
            let diseaseArr: DiseaseNode[] = [] as DiseaseNode[];
            if (data) {
              if (data.treeBranch) {
                diseaseArr = data.treeBranch[0].nodes.map(
                  (obj: Partial<DiseaseNode>) => new DiseaseNode(obj),
                );
              } else if (tree) {
                diseaseArr = _addToTree(data.diseases[0], tree);
              } else if (data.diseases) {
                diseaseArr = data.diseases.map(
                  (obj: Partial<DiseaseNode>) => new DiseaseNode(obj),
                );
              }
              return BrowseDiseaseListActions.fetchDiseaseTreeSuccess({
                diseases: diseaseArr,
              });
            } else
              return BrowseDiseaseListActions.fetchDiseaseTreeFailure({
                error: 'No Disease found',
              });
          }),
        );
      }),
    );
  },
  { functional: true },
);

//get tree branch data
export const fetchTreeBranch$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    diseaseService = inject(DiseaseService),
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) =>
        r.payload.routerState.url.startsWith('/diseasess'),
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams,
      ),
      concatLatestFrom(() => store.select(DiseaseSelectors.getDiseaseTree)),
      mergeMap(([params, tree]) => {
        let query;
        let qParams: { [key: string]: unknown } | undefined;
        if (!tree) {
          if (params['parentId']) {
            query = FETCHPATH;
            qParams = { searchString: params['parentId'] };
            if (params['phenotypes']) {
              qParams['where'] = {
                hasPhenotypePhenotypes_SOME: {
                  HPOTerm_IN: params['phenotypes'].split('&'),
                },
              };
            }
          } else {
            query = FETCHROOT;
            qParams = params['phenotypes']
              ? {
                  where: {
                    hasPhenotypePhenotypes_SOME: {
                      HPOTerm_IN: params['phenotypes'].split('&'),
                    },
                  },
                }
              : undefined;
          }
        } else {
          if (params['pageIndex']) {
            query = FETCHROOT;
            qParams = params['phenotypes']
              ? {
                  where: {
                    hasPhenotypePhenotypes_SOME: {
                      HPOTerm_IN: params['phenotypes'].split('&'),
                    },
                  },
                }
              : undefined;
          } else {
            if (params['parentId']) {
              DISEASEQUERYPARAMETERS.where = { GardId: params['parentId'] };
              if (params['phenotypes']) {
                DISEASEQUERYPARAMETERS.where.hasPhenotypePhenotypes_SOME = {
                  HPOTerm_IN: params['phenotypes'].split('&'),
                };
              }
              query = CATEGORYTREEBRANCH;
              qParams = DISEASEQUERYPARAMETERS;
            } else {
              query = FETCHROOT;
              qParams = params['phenotypes']
                ? {
                    where: {
                      hasPhenotypePhenotypes_SOME: {
                        HPOTerm_IN: params['phenotypes'].split('&'),
                      },
                    },
                  }
                : undefined;
            }
          }
        }

        return diseaseService.fetchDiseases(query, qParams).pipe(
          map((res: ObservableQuery.Result<unknown>) => {
            const data: {
              treeBranch: { nodes: DiseaseNode[] }[];
              diseases: DiseaseNode[];
            } = res.data as {
              treeBranch: { nodes: DiseaseNode[] }[];
              diseases: DiseaseNode[];
            };
            let diseaseArr: DiseaseNode[] = [] as DiseaseNode[];
            if (data) {
              if (data.treeBranch) {
                diseaseArr = data.treeBranch[0].nodes
                  .map((obj: Partial<DiseaseNode>) => new DiseaseNode(obj))
                  .sort((a: DiseaseNode, b: DiseaseNode) => b.count - a.count);
              } else if (tree) {
                diseaseArr = _addToTree(data.diseases[0], tree);
              } else if (data.diseases) {
                diseaseArr = data.diseases
                  .map((obj: Partial<DiseaseNode>) => new DiseaseNode(obj))
                  .sort((a: DiseaseNode, b: DiseaseNode) => b.count - a.count);
              }
              return BrowseDiseaseListActions.fetchDiseaseTreeSuccess({
                diseases: diseaseArr,
              });
            } else
              return BrowseDiseaseListActions.fetchDiseaseTreeFailure({
                error: 'No Disease found',
              });
          }),
        );
      }),
    );
  },
  { functional: true },
);

// gets all filter for disease/trials/projects to show charts on browse page
export const loadAllDiseaseFilters$ = createEffect(
  (actions$ = inject(Actions), diseaseService = inject(DiseaseService)) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) =>
        r.payload.routerState.url.startsWith('/diseases'),
      ),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      mergeMap((root: ActivatedRouteSnapshot) => {
        const params: Params = root.queryParams;
        return combineLatest(
          diseaseService.fetchArticles(ALLARTICLEFILTERS).pipe(take(1)),
          diseaseService.fetchProjects(ALLPROJECTFILTERS).pipe(take(1)),
          diseaseService.fetchTrials(ALLTRIALFILTERS).pipe(take(1)),
        ).pipe(
          map(
            ([articleFilterData, projectFilterData, trialFilterData]: [
              ObservableQuery.Result<unknown>,
              ObservableQuery.Result<unknown>,
              ObservableQuery.Result<unknown>,
            ]) => {
              const filters: FilterCategory[] = [];
              if (articleFilterData || projectFilterData || trialFilterData) {
                if (articleFilterData) {
                  const articleFilterDataList: {
                    allCountsByYear: Filter[];
                    allCountsByEpi: Filter[];
                    allCountsByNHS: Filter[];
                  } = articleFilterData.data as {
                    allCountsByYear: Filter[];
                    allCountsByEpi: Filter[];
                    allCountsByNHS: Filter[];
                  };
                  if (articleFilterDataList.allCountsByYear.length) {
                    filters.push(
                      new FilterCategory({
                        parent: 'articles',
                        label: 'All Articles by Year',
                        // filterable: false,
                        field: 'year',
                        values: articleFilterDataList.allCountsByYear
                          .filter((fil) => fil.term != '')
                          .map((fil: Partial<Filter>) => new Filter(fil)),
                      }),
                    );
                  }
                  if (articleFilterDataList.allCountsByEpi.length) {
                    filters.push(
                      new FilterCategory({
                        parent: 'articles',
                        label: 'Epidemiology Articles by Year',
                        field: 'year',
                        values: articleFilterDataList.allCountsByEpi
                          .filter((fil) => fil.term != '')
                          .filter(
                            (year: Partial<Filter>) =>
                              year.label == 'Epidemiology Articles',
                          )
                          .map(
                            (fil: Partial<Filter>) =>
                              new Filter({ ...fil, label: 'year' }),
                          ),
                      }),
                    );
                  }
                  if (articleFilterDataList.allCountsByNHS.length) {
                    filters.push(
                      new FilterCategory({
                        parent: 'articles',
                        label: 'Natural Health Study Articles by Year',
                        field: 'year',
                        values: articleFilterDataList.allCountsByNHS
                          .filter((fil) => fil.term != '')
                          .filter(
                            (year: Partial<Filter>) =>
                              year.label == 'Natural Health Study Articles',
                          )
                          .map(
                            (fil: Partial<Filter>) =>
                              new Filter({ ...fil, label: 'year' }),
                          ),
                      }),
                    );
                  }
                }
                if (projectFilterData) {
                  const projectFilterDataList: {
                    allCountsByYear: Filter[];
                    allFundingByYear: Filter[];
                  } = projectFilterData.data as {
                    allCountsByYear: Filter[];
                    allFundingByYear: Filter[];
                  };

                  if (projectFilterDataList.allCountsByYear.length) {
                    filters.push(
                      new FilterCategory({
                        parent: 'projects',
                        label: 'Projects Count by Year',
                        filterable: false,
                        values: projectFilterDataList.allCountsByYear.map(
                          (fil: Partial<Filter>) => new Filter(fil),
                        ),
                      }),
                    );
                  }
                  if (projectFilterDataList.allFundingByYear.length) {
                    filters.push(
                      new FilterCategory({
                        parent: 'projects',
                        label: 'Projects Funding by Year',
                        filterable: false,
                        values: projectFilterDataList.allFundingByYear.map(
                          (fil: Partial<Filter>) => new Filter(fil),
                        ),
                      }),
                    );
                  }
                }
                if (trialFilterData) {
                  const trialFilterDataList: {
                    allTrialsByStatus: Filter[];
                    allTrialsByType: Filter[];
                    allTrialsByPhase: Filter[];
                  } = trialFilterData.data as {
                    allTrialsByStatus: Filter[];
                    allTrialsByType: Filter[];
                    allTrialsByPhase: Filter[];
                  };
                  if (
                    trialFilterDataList.allTrialsByStatus &&
                    trialFilterDataList.allTrialsByStatus.length
                  ) {
                    filters.push(
                      new FilterCategory({
                        parent: 'trials',
                        label: 'Clinical Trials by Status',
                        field: 'OverallStatus',
                        values: trialFilterDataList.allTrialsByStatus.map(
                          (fil: Partial<Filter>) =>
                            new Filter({
                              ...fil,
                              selected:
                                params['OverallStatus'] === fil.term ||
                                params['OverallStatus']?.includes(fil.term),
                            }),
                        ),
                      }),
                    );
                  }
                  if (
                    trialFilterDataList.allTrialsByType &&
                    trialFilterDataList.allTrialsByType.length
                  ) {
                    filters.push(
                      new FilterCategory({
                        parent: 'trials',
                        label: 'Clinical Trials by Type',
                        field: 'StudyType',
                        values: trialFilterDataList.allTrialsByType.map(
                          (fil: Partial<Filter>) => new Filter(fil),
                        ),
                      }),
                    );
                  }
                  if (
                    trialFilterDataList.allTrialsByPhase &&
                    trialFilterDataList.allTrialsByPhase.length
                  ) {
                    filters.push(
                      new FilterCategory({
                        parent: 'trials',
                        label: 'Clinical Trials by Phase',
                        field: 'Phase',
                        values: trialFilterDataList.allTrialsByPhase.map(
                          (fil: Partial<Filter>) => new Filter(fil),
                        ),
                      }),
                    );
                  }
                }
                return FetchDiseaseListActions.fetchAllDiseaseFiltersSuccess({
                  filters: filters,
                });
              } else
                return FetchDiseaseListActions.fetchAllDiseaseFiltersFailure({
                  error: 'No Filters found',
                });
            },
          ),
        );
      }),
    );
  },
  { functional: true },
);


function _addToTree(
  data: DiseaseNode,
  parent?: DiseaseNode[] | undefined,
): DiseaseNode[] {
  let ret: DiseaseNode[] = [] as DiseaseNode[];
  const dNode = new DiseaseNode(data);
  if (!parent) {
    return [data];
  } else {
    const diseaseMap = new Map<string, DiseaseNode>();
    let found = false;
    parent.map((disease) => {
      if (disease.gardId === dNode.gardId) {
        found = true;
        diseaseMap.set(dNode.gardId, dNode);
      } else {
        diseaseMap.set(disease.gardId, disease);
      }
    });
    if (found) {
      ret = [...diseaseMap.values()].sort((a, b) => b.count - a.count);
    } else {
      parent.some((disease) => {
        if (disease.children) {
          const lll = _addToTree(dNode, disease.children);
          const d2: DiseaseNode = new DiseaseNode({
            ...disease,
            children: lll,
          });
          diseaseMap.set(d2.gardId, d2);
          ret = [...diseaseMap.values()].sort((a, b) => b.count - a.count);
        }
      });
    }
    return ret;
  }
}
*/






function _makePage(params: Params, total: { count: number } | number) {
  const pageSize: number = params['pageSize']
    ? (params['pageSize'] as number)
    : 10;
  const pageIndex: number = params['pageIndex'] ? params['pageIndex'] - 1 : 0;
  const page: Page = {
    pageSize: pageSize,
    pageIndex: pageIndex,
    total: typeof total !== 'number' ? total.count : total,
  };
  return page;
}
