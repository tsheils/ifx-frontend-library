import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Params } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client';
import {
  Article,
  CATEGORYTREEBRANCH,
  ClinicalTrial,
  CoreProject,
  Disease,
  DiseaseNode,
  DISEASEBRANCHPARAMETERS,
  DISEASEQUERYPARAMETERS,
  DISEASETYPEAHEAD,
  FETCHARTICLESQUERY,
  FETCHDISEASEQUERY,
  FETCHDISEASESLISTQUERY,
  FETCHPATH,
  FETCHPATHDISEASES,
  FETCHPROJECTSQUERY,
  LISTQUERYPARAMETERS,
  PROJECTVARIABLES,
  FETCHROOT,
  FETCHTRIALSVARIABLES,
  FETCHTRIALSQUERY,
  EPIARTICLES,
  NONEPIARTICLES,
  DISEASELIST,
  ARTICLEFILTERS,
  PROJECTFILTERS,
  TRIALFILTERS,
  ALLARTICLEFILTERS,
  ALLPROJECTFILTERS,
  ALLTRIALFILTERS,
  TRIALTYPEFILTERS,
  TRIALSTATUSFILTERS,
  TRIALPHASEFILTERS,
  ALLARTICLES,
  NHSARTICLES,
} from '@ncats-frontend-library/models/rdas';
import {
  Filter,
  FilterCategory,
  Page,
} from '@ncats-frontend-library/models/utils';
import { Store } from '@ngrx/store';
import { DiseaseService } from '../disease.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { combineLatest, filter, map, mergeMap, switchMap, take } from 'rxjs';
import {
  BrowseDiseaseListActions,
  FetchDiseaseActions,
  FetchDiseaseListActions,
  SearchDiseasesActions,
} from './diseases.actions';
import * as DiseaseSelectors from './diseases.selectors';

export const fetchDiseaseListFromIds$ = createEffect(
  (actions$ = inject(Actions), diseaseService = inject(DiseaseService)) => {
    return actions$.pipe(
      ofType(FetchDiseaseListActions.fetchDiseaseList),
      mergeMap((action: { gardIds: string[] }) => {
        return diseaseService
          .fetchDiseases(DISEASELIST, { where: { GardId_IN: action.gardIds } })
          .pipe(
            map((res: ApolloQueryResult<unknown>) => {
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

export const loadStaticDiseaseFilters$ = createEffect(
  (actions$ = inject(Actions), diseaseService = inject(DiseaseService)) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/diseases') &&
          r.payload.routerState.url.startsWith('/disease'),
      ),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      mergeMap((root: ActivatedRouteSnapshot) => {
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
            .fetchTrials(TRIALFILTERS, {
              ctfilters: {
                mappedToGardGards_SOME: { GardId: gardid },
              },
            })
            .pipe(take(1)),
        ).pipe(
          map(
            ([articleFilterData, projectFilterData, trialFilterData]: [
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
            ]) => {
              if (articleFilterData || projectFilterData || trialFilterData) {
                const filters = _parseFilterResponse(
                  articleFilterData,
                  projectFilterData,
                  trialFilterData,
                  params,
                );
                return FetchDiseaseActions.fetchStaticDiseaseFiltersSuccess({
                  filters: filters,
                });
              } else
                return FetchDiseaseActions.fetchStaticDiseaseFiltersFailure({
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

export const loadDiseaseFilters$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    diseaseService = inject(DiseaseService),
  ) => {
    return actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/diseases') &&
          r.payload.routerState.url.startsWith('/disease'),
      ),
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
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
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
                } as ApolloQueryResult<unknown>;
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

export const loadDisease$ = createEffect(
  (actions$ = inject(Actions), diseaseService = inject(DiseaseService)) => {
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
        const gardid: string = params['id'];
        _setGardId(gardid);
        if (root.fragment) {
          _setFragment(root.fragment, params);
        }

        return diseaseService
          .fetchDiseases(FETCHDISEASEQUERY, DISEASEQUERYPARAMETERS)
          .pipe(
            map((diseaseData: ApolloQueryResult<unknown>) => {
              if (diseaseData && diseaseData.data) {
                const diseaseObj: Disease = _makeDiseaseObj(diseaseData);
                return FetchDiseaseActions.fetchDiseaseSuccess({
                  disease: diseaseObj,
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

export const searchDiseases$ = createEffect(
  (actions$ = inject(Actions), diseaseService = inject(DiseaseService)) => {
    return actions$.pipe(
      ofType(SearchDiseasesActions.searchDiseases),
      mergeMap((action: { term: string }) => {
        return diseaseService
          .fetchDiseases(DISEASETYPEAHEAD, {
            searchString: action.term.split(' ').join('~ AND ') + '*',
            limit: 10,
          })
          .pipe(
            map((res: ApolloQueryResult<unknown>) => {
              const data: { diseaseSearch: Disease[] } = res.data as {
                diseaseSearch: Disease[];
              };
              if (data) {
                const diseaseArr = data.diseaseSearch.map(
                  (obj: Partial<Disease>) => new Disease(obj),
                );
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

export const fetchTreeBranch$ = createEffect(
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
          map((res: ApolloQueryResult<unknown>) => {
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
                  .sort(
                    (a: DiseaseNode, b: DiseaseNode) =>
                      b.childrenCount - a.childrenCount,
                  );
              } else if (tree) {
                diseaseArr = _addToTree(data.diseases[0], tree);
              } else if (data.diseases) {
                diseaseArr = data.diseases
                  .map((obj: Partial<DiseaseNode>) => new DiseaseNode(obj))
                  .sort(
                    (a: DiseaseNode, b: DiseaseNode) =>
                      b.childrenCount - a.childrenCount,
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

export const fetchDiseasesList$ = createEffect(
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
      switchMap(
        (params: {
          pageSize?: number;
          pageIndex?: number;
          parentId?: string;
          sort?: string;
          direction?: string;
          phenotypes?: string;
          genes?: string;
          q?: string;
        }) => {
          let query;
          let queryParams;
          const pageSize: number = params.pageSize
            ? (params.pageSize as number)
            : 10;
          const pageIndex: number = params.pageIndex ? params.pageIndex - 1 : 0;
          if (params.parentId) {
            DISEASEBRANCHPARAMETERS.searchString = params.parentId;
            DISEASEBRANCHPARAMETERS.limit = +pageSize;
            DISEASEBRANCHPARAMETERS.skip = +pageSize * +pageIndex;
            query = FETCHPATHDISEASES;
            queryParams = DISEASEBRANCHPARAMETERS;
          } else {
            LISTQUERYPARAMETERS.options['limit'] = +pageSize;
            LISTQUERYPARAMETERS.options['offset'] = +pageSize * +pageIndex;
            if (params.sort) {
              LISTQUERYPARAMETERS.options.sort = [
                {
                  [params.sort]: params.direction ? params.direction : 'DESC',
                },
              ];
            }
            queryParams = LISTQUERYPARAMETERS;
            query = FETCHDISEASESLISTQUERY;
          }
          if (params.q) {
            if (!queryParams.where) {
              queryParams.where = { GardName_CONTAINS: params.q };
            } else {
              queryParams.where.GardName_CONTAINS = params.q;
            }
          }
          if (params.phenotypes && params.genes) {
            queryParams.where = {
              GardName_CONTAINS: params.q ? params.q : undefined,
              hasPhenotypePhenotypes_SOME: {
                HPOTerm_IN: params.phenotypes.split('&'),
              },
              AND: [
                {
                  associatedWithGeneGenes_SOME: {
                    GeneSymbol_IN: params.genes.split('&'),
                  },
                },
              ],
            };
          } else {
            if (params.phenotypes) {
              queryParams.where = {
                GardName_CONTAINS: params.q ? params.q : undefined,
                hasPhenotypePhenotypes_SOME: {
                  HPOTerm_IN: params.phenotypes.split('&'),
                },
              };
            }
            if (params.genes) {
              queryParams.where = {
                GardName_CONTAINS: params.q ? params.q : undefined,
                associatedWithGeneGenes_SOME: {
                  GeneSymbol_IN: params.genes.split('&'),
                },
              };
            }
          }
          return diseaseService.fetchDiseases(query, queryParams).pipe(
            map((res: ApolloQueryResult<unknown>) => {
              const data: {
                diseases: Disease[];
                total: { count: number } | number;
              } = res.data as {
                diseases: Disease[];
                total: { count: number } | number;
              };
              if (data) {
                let page: Page;
                if (typeof data.total !== 'number') {
                  page = {
                    pageSize: pageSize,
                    pageIndex: pageIndex,
                    total: data.total.count,
                  } as Page;
                } else {
                  page = {
                    pageSize: pageSize,
                    pageIndex: pageIndex,
                    total: data.total,
                  } as Page;
                }
                const diseaseArr: Disease[] = data.diseases.map(
                  (obj: Partial<Disease>) => new Disease(obj),
                );
                return BrowseDiseaseListActions.fetchDiseaseListSuccess({
                  diseases: diseaseArr,
                  page: page,
                });
              } else
                return BrowseDiseaseListActions.fetchDiseaseListFailure({
                  error: 'No Disease found',
                });
            }),
          );
        },
      ),
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
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
            ]) => {
              const filters: FilterCategory[] = [];
              if (articleFilterData || projectFilterData || trialFilterData) {
                if (articleFilterData) {
                  const articleFilterDataList: { allCountsByYear: Filter[] } =
                    articleFilterData.data as {
                      allCountsByYear: Filter[];
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
                    const fc = new FilterCategory({
                      parent: 'articles',
                      label: 'Epidemiology Articles by Year',
                      field: 'year',
                      values: articleFilterDataList.allCountsByYear
                        .filter((fil) => fil.term != '')
                        .filter(
                          (year: Partial<Filter>) =>
                            year.label == 'Epidemiology Articles',
                        )
                        .map(
                          (fil: Partial<Filter>) =>
                            new Filter({ ...fil, label: 'year' }),
                        ),
                    });
                    filters.push(fc);
                    filters.push(
                      new FilterCategory({
                        parent: 'articles',
                        label: 'Articles by Year',
                        field: 'year',
                        values: articleFilterDataList.allCountsByYear
                          .filter((fil) => fil.term != '')
                          .filter(
                            (year: Partial<Filter>) =>
                              year.label == 'Non Epidemiology Articles',
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
                  const dataObj: {
                    allProjectFilters: {
                      countsByYear: Filter[];
                      fundingByYear: Filter[];
                    };
                  } = projectFilterData.data as {
                    allProjectFilters: {
                      countsByYear: Filter[];
                      fundingByYear: Filter[];
                    };
                  };
                  const projectFilterDataList: {
                    countsByYear: Filter[];
                    fundingByYear: Filter[];
                  } = dataObj.allProjectFilters as {
                    countsByYear: Filter[];
                    fundingByYear: Filter[];
                  };
                  if (projectFilterDataList.countsByYear.length) {
                    filters.push(
                      new FilterCategory({
                        parent: 'projects',
                        label: 'Projects Count by Year',
                        filterable: false,
                        values: projectFilterDataList.countsByYear.map(
                          (fil: Partial<Filter>) => new Filter(fil),
                        ),
                      }),
                    );
                  }
                  if (projectFilterDataList.fundingByYear.length) {
                    filters.push(
                      new FilterCategory({
                        parent: 'projects',
                        label: 'Projects Funding by Year',
                        filterable: false,
                        values: projectFilterDataList.fundingByYear.map(
                          (fil: Partial<Filter>) => new Filter(fil),
                        ),
                      }),
                    );
                  }
                }
                if (trialFilterData) {
                  const dataObj: {
                    allDiseaseClinicalTrialsFilters: {
                      trialsByStatus: Filter[];
                      trialsByType: Filter[];
                      trialsByPhase: Filter[];
                    };
                  } = trialFilterData.data as {
                    allDiseaseClinicalTrialsFilters: {
                      trialsByStatus: Filter[];
                      trialsByType: Filter[];
                      trialsByPhase: Filter[];
                    };
                  };
                  const trialFilterDataList: {
                    trialsByStatus: Filter[];
                    trialsByType: Filter[];
                    trialsByPhase: Filter[];
                  } = dataObj.allDiseaseClinicalTrialsFilters as {
                    trialsByStatus: Filter[];
                    trialsByType: Filter[];
                    trialsByPhase: Filter[];
                  };
                  if (
                    trialFilterDataList.trialsByStatus &&
                    trialFilterDataList.trialsByStatus.length
                  ) {
                    filters.push(
                      new FilterCategory({
                        parent: 'trials',
                        label: 'Clinical Trials by Status',
                        field: 'OverallStatus',
                        values: trialFilterDataList.trialsByStatus.map(
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
                    trialFilterDataList.trialsByType &&
                    trialFilterDataList.trialsByType.length
                  ) {
                    filters.push(
                      new FilterCategory({
                        parent: 'trials',
                        label: 'Clinical Trials by Type',
                        field: 'StudyType',
                        values: trialFilterDataList.trialsByType.map(
                          (fil: Partial<Filter>) => new Filter(fil),
                        ),
                      }),
                    );
                  }
                  if (
                    trialFilterDataList.trialsByPhase &&
                    trialFilterDataList.trialsByPhase.length
                  ) {
                    filters.push(
                      new FilterCategory({
                        parent: 'trials',
                        label: 'Clinical Trials by Phase',
                        field: 'Phase',
                        values: trialFilterDataList.trialsByPhase.map(
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

function _makeDiseaseObj(
  diseaseData: ApolloQueryResult<unknown>,
  articleData?: ApolloQueryResult<unknown>,
  projectsData?: ApolloQueryResult<unknown>,
  trialsData?: ApolloQueryResult<unknown>,
): Disease {
  const disease: { disease: Disease[] } = diseaseData.data as {
    disease: Disease[];
  };
  if (disease) {
    const diseaseObj: Disease = new Disease(disease.disease[0]);
    if (articleData) {
      const articles: {
        articles: {
          articles: Article[];
          _count: { count: number };
          allCount: { count: number };
        }[];
      } = articleData.data as {
        articles: {
          articles: Article[];
          _count: { count: number };
          allCount: { count: number };
        }[];
      };
      if (articles) {
        /*diseaseObj.allArticles = articles.articles[0].articles.map(
          (art: Partial<Article>) => new Article(art),
        );
        diseaseObj.allArticleCount = articles.articles[0]._count.count;
        diseaseObj.articleCount = articles.articles[0].allCount.count;*/
        /*diseaseObj.epiCount = epiArticles.articles[0]._count.count;
        diseaseObj.allEpiCount = epiArticles.articles[0].allCount.count;
        diseaseObj.nhsCount = nhsArticles.articles[0]._count.count;
        diseaseObj.allNhsCount = nhsArticles.articles[0].allCount.count;*/
      }
    }

    if (projectsData) {
      const projects: {
        coreProjects: CoreProject[];
        count: { count: number };
      } = projectsData.data as {
        coreProjects: CoreProject[];
        count: { count: number };
      };
      diseaseObj.projects = projects.coreProjects.map(
        (proj: Partial<CoreProject>) => new CoreProject(proj),
      );
      diseaseObj.projectCount = projects.count.count;
      diseaseObj.allProjectCount = projects.count.count;
    }
    if (trialsData) {
      const trials: {
        clinicalTrials: ClinicalTrial[];
        count: { count: number };
        allCount: { count: number };
      } = trialsData.data as {
        clinicalTrials: ClinicalTrial[];
        count: { count: number };
        allCount: { count: number };
      };
      diseaseObj.clinicalTrials = trials.clinicalTrials.map(
        (trial: Partial<ClinicalTrial>) => new ClinicalTrial(trial),
      );
      diseaseObj.allClinicalTrialCount = trials.allCount.count;
      diseaseObj.clinicalTrialCount = trials.count.count;
    }
    return diseaseObj;
  } else return new Disease({});
}

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
      ret = [...diseaseMap.values()].sort(
        (a, b) => b.childrenCount - a.childrenCount,
      );
    } else {
      parent.some((disease) => {
        if (disease.children) {
          const lll = _addToTree(dNode, disease.children);
          const d2: DiseaseNode = new DiseaseNode({
            ...disease,
            children: lll,
          });
          diseaseMap.set(d2.gardId, d2);
          ret = [...diseaseMap.values()].sort(
            (a, b) => b.childrenCount - a.childrenCount,
          );
        }
      });
    }
    return ret;
  }
}

function _setFragment(
  origin: string | null,
  options: {
    limit?: number;
    offset?: number;
    year?: string | string[];
    GardId?: string;
    OverallStatus?: string[];
    StudyType?: string[];
    Phase?: string[];
  },
) {
  switch (origin) {
    case 'epiArticles': {
      EPIARTICLES.articleOptions.limit = <number>options['limit']
        ? <number>options['limit']
        : 10;
      if (<number>options['offset']) {
        EPIARTICLES.articleOptions.offset = <number>options['offset'] * 1;
      }
      if (options['year'] && options['year'].length > 0) {
        EPIARTICLES.articleFilter.publicationYear_IN = options['year'];
      } else {
        EPIARTICLES.articleFilter.publicationYear_IN = undefined;
      }
      break;
    }
    case 'articles': {
      ALLARTICLES.articleOptions.limit = <number>options['limit']
        ? <number>options['limit']
        : 10;
      if (<number>options['offset']) {
        ALLARTICLES.articleOptions.offset = <number>options['offset'] * 1;
      }
      if (options['year'] && options['year'].length > 0) {
        ALLARTICLES.articleFilter.publicationYear_IN = options['year'];
      } else {
        //  NONEPIARTICLES.articleFilter.publicationYear_IN = undefined;
      }
      break;
    }
    case 'projects': {
      PROJECTVARIABLES.coreProjectsOptions.limit = <number>options['limit']
        ? <number>options['limit']
        : 10;
      if (<number>options['offset']) {
        PROJECTVARIABLES.coreProjectsOptions.offset =
          <number>options['offset'] * 1;
      }
      break;
    }
    case 'trials': {
      FETCHTRIALSVARIABLES.ctoptions.limit = <number>options['limit']
        ? <number>options['limit']
        : 10;
      if (<number>options['offset']) {
        FETCHTRIALSVARIABLES.ctoptions.offset = <number>options['offset'] * 1;
      } else {
        FETCHTRIALSVARIABLES.ctoptions.offset = 0;
      }
      if (options['GardId']) {
        FETCHTRIALSVARIABLES.ctwhere.mappedToGardGards_SOME.GardId = <string>(
          options['GardId']
        );
      }
      if (options['OverallStatus'] && options['OverallStatus'].length > 0) {
        FETCHTRIALSVARIABLES.ctfilters.OverallStatus_IN =
          options['OverallStatus'];
      } else {
        FETCHTRIALSVARIABLES.ctfilters.OverallStatus_IN = undefined;
      }
      if (options['StudyType'] && options['StudyType'].length > 0) {
        FETCHTRIALSVARIABLES.ctfilters.StudyType_IN = options['StudyType'];
      } else {
        FETCHTRIALSVARIABLES.ctfilters.StudyType_IN = undefined;
      }
      if (options['Phase'] && options['Phase'].length > 0) {
        FETCHTRIALSVARIABLES.ctfilters.Phase_IN = options['Phase'];
      } else {
        FETCHTRIALSVARIABLES.ctfilters.Phase_IN = undefined;
      }
      break;
    }
  }
}

function _setGardId(gardid: string) {
  DISEASEQUERYPARAMETERS.where = { GardId: gardid };
  EPIARTICLES.gardWhere.GardId = gardid;
  ALLARTICLES.gardWhere.GardId = gardid;
  PROJECTVARIABLES.coreProjectsWhere.projectsUnderCore_SOME.gardsresearchedBy_SOME.GardId =
    gardid;
  FETCHTRIALSVARIABLES.ctwhere.mappedToGardGards_SOME.GardId = gardid;
  FETCHTRIALSVARIABLES.ctfilters.mappedToGardGards_SOME.GardId = gardid;
}

function _setTrialVariables(params: Params, origin: string) {
  if (origin !== 'type' && params['StudyType'] && params['StudyType'].length) {
    FETCHTRIALSVARIABLES.ctfilters.StudyType_IN = params['StudyType'];
  } else {
    FETCHTRIALSVARIABLES.ctfilters.StudyType_IN = null;
  }
  if (origin !== 'phase' && params['Phase'] && params['Phase'].length) {
    FETCHTRIALSVARIABLES.ctfilters.Phase_IN = params['Phase'];
  } else {
    FETCHTRIALSVARIABLES.ctfilters.Phase_IN = null;
  }
  if (
    origin !== 'status' &&
    params['OverallStatus'] &&
    params['OverallStatus'].length
  ) {
    FETCHTRIALSVARIABLES.ctfilters.OverallStatus_IN = params['OverallStatus'];
  } else {
    FETCHTRIALSVARIABLES.ctfilters.OverallStatus_IN = null;
  }
  return FETCHTRIALSVARIABLES;
}

function _setArticleVariables(params: Params) {
  if (params['year'] && params['year'].length) {
    // FETCHART.ctfilters.StudyType_IN = params['StudyType']
  } else {
    FETCHTRIALSVARIABLES.ctfilters.StudyType_IN = null;
  }

  return FETCHTRIALSVARIABLES;
}

function _parseFilterResponse(
  articleFilterData: ApolloQueryResult<unknown>,
  projectFilterData: ApolloQueryResult<unknown>,
  trialFilterData: ApolloQueryResult<unknown>,
  params: Params,
): FilterCategory[] {
  const filters: FilterCategory[] = [];
  if (articleFilterData) {
    const articleFilterDataList: {
      countsByYear: Filter[];
      countsByEpi: Filter[];
      countsByNHS: Filter[];
    } = articleFilterData.data as {
      countsByYear: Filter[];
      countsByEpi: Filter[];
      countsByNHS: Filter[];
    };
    if (articleFilterDataList.countsByYear.length) {
      filters.push(
        new FilterCategory({
          parent: 'articles',
          label: 'Articles by Year',
          field: 'year',
          values: articleFilterDataList.countsByYear.map(
            (fil: Partial<Filter>) => new Filter(fil),
          ),
        }),
      );
      const fc = new FilterCategory({
        parent: 'articles',
        label: 'Epidemiology Articles ',
        field: 'isEpi',
        values: articleFilterDataList.countsByEpi.map(
          (fil: Partial<Filter>) => new Filter({ ...fil, label: 'isEpi' }),
        ),
      });
      filters.push(fc);
      filters.push(
        new FilterCategory({
          parent: 'articles',
          label: 'Natural Health Study Articles',
          field: 'isNHS',
          values: articleFilterDataList.countsByNHS.map(
            (fil: Partial<Filter>) => new Filter({ ...fil, label: 'isNHS' }),
          ),
        }),
      );
    }
  }
  if (projectFilterData) {
    const projectFilterDataList: {
      countsByYear: Filter[];
      costByYear: Filter[];
    } = projectFilterData.data as {
      countsByYear: Filter[];
      costByYear: Filter[];
    };
    if (projectFilterDataList.countsByYear.length) {
      filters.push(
        new FilterCategory({
          parent: 'projects',
          label: 'Projects Count by Year',
          filterable: false,
          values: projectFilterDataList.countsByYear.map(
            (fil: Partial<Filter>) => new Filter(fil),
          ),
        }),
      );
    }
    if (projectFilterDataList.costByYear.length) {
      filters.push(
        new FilterCategory({
          parent: 'projects',
          label: 'Projects Funding by Year',
          filterable: false,
          values: projectFilterDataList.costByYear.map(
            (fil: Partial<Filter>) => new Filter(fil),
          ),
        }),
      );
    }
  }
  if (trialFilterData) {
    const dataObj: {
      allClinicalTrialsFilters: {
        trialsByStatus: Filter[];
        trialsByType: Filter[];
        trialsByPhase: Filter[];
      };
    } = trialFilterData.data as {
      allClinicalTrialsFilters: {
        trialsByStatus: Filter[];
        trialsByType: Filter[];
        trialsByPhase: Filter[];
      };
    };
    const trialFilterDataList: {
      trialsByStatus: Filter[];
      trialsByType: Filter[];
      trialsByPhase: Filter[];
    } = dataObj.allClinicalTrialsFilters as {
      trialsByStatus: Filter[];
      trialsByType: Filter[];
      trialsByPhase: Filter[];
    };
    if (
      trialFilterDataList.trialsByStatus &&
      trialFilterDataList.trialsByStatus.length
    ) {
      filters.push(
        new FilterCategory({
          parent: 'trials',
          label: 'Clinical Trials by Status',
          field: 'OverallStatus',
          values: trialFilterDataList.trialsByStatus.map(
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
      trialFilterDataList.trialsByType &&
      trialFilterDataList.trialsByType.length
    ) {
      filters.push(
        new FilterCategory({
          parent: 'trials',
          label: 'Clinical Trials by Type',
          field: 'StudyType',
          values: trialFilterDataList.trialsByType.map(
            (fil: Partial<Filter>) => new Filter(fil),
          ),
        }),
      );
    }
    if (
      trialFilterDataList.trialsByPhase &&
      trialFilterDataList.trialsByPhase.length
    ) {
      filters.push(
        new FilterCategory({
          parent: 'trials',
          label: 'Clinical Trials by Phase',
          field: 'Phase',
          values: trialFilterDataList.trialsByPhase.map(
            (fil: Partial<Filter>) => new Filter(fil),
          ),
        }),
      );
    }
  }
  return filters;
}
