import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Params } from "@angular/router";
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
  DISEASELIST, ARTICLEFILTERS, PROJECTFILTERS, TRIALFILTERS
} from "@ncats-frontend-library/models/rdas";
import {
  Filter,
  FilterCategory,
  Page,
} from '@ncats-frontend-library/models/utils';
import { Store } from '@ngrx/store';
import { DiseaseService } from '../disease.service';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import {
  combineLatest,
  filter,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  take,
} from 'rxjs';
import * as DiseasesActions from './diseases.actions';
import * as fromDiseasesSelectors from './diseases.selectors';


interface DEFAULTOPTIONS {
  limit?: number,
  offset?: number,
  GardId?: string,
  OverallStatus?: string | string[] | null| undefined,
  StudyType?: string | string[] | null |undefined
}

@Injectable()
export class DiseasesEffects {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchDiseases = createEffect((): any =>
    inject(Actions).pipe(
      ofType(DiseasesActions.searchDiseases),
      mergeMap((action: { term: string }) => {
        return this.diseaseService
          .fetchDiseases(DISEASETYPEAHEAD, { searchString: action.term + '~', limit: 10 })
          .pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((res: any) => {
              if (res.data && res.data.diseaseSearch) {
                const diseaseArr = res.data.diseaseSearch.map(
                  (obj: Partial<Disease>) => new Disease(obj)
                );
                return DiseasesActions.searchDiseasesSuccess({
                  typeahead: diseaseArr,
                });
              } else
                return DiseasesActions.searchDiseasesFailure({
                  error: 'No Diseases found',
                });
            })
          );
      })
    )
  );

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadDiseases$ = createEffect((): any =>
    inject(Actions).pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) =>
        r.payload.routerState.url.startsWith('/diseases')
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams
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
          if(params.q){
            if(!queryParams.where) {
              queryParams.where = {GardName_CONTAINS: params.q}
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
          return this.diseaseService.fetchDiseases(query, queryParams).pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((res: any) => {
              if (res && res.data) {
                const page: Page = {
                  pageSize: pageSize,
                  pageIndex: pageIndex,
                  total: res.data.total.count
                    ? res.data.total.count
                    : res.data.total,
                };
                const diseaseArr: Disease[] = res.data.diseases.map(
                  (obj: Partial<Disease>) => new Disease(obj)
                );
                return DiseasesActions.loadDiseasesSuccess({
                  diseases: diseaseArr,
                  page: page,
                });
              } else
                return DiseasesActions.loadDiseasesFailure({
                  error: 'No Disease found',
                });
            })
          );
        }
      )
    )
  );

 /* //paginate through disease sub-sections (projects, publications, clinical trials)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchDisease = createEffect((): any =>
    inject(Actions).pipe(
      ofType(DiseasesActions.fetchDisease),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mergeMap((action: any) => {
        if (action.fragment) {
          this._setFragment(action.origin, action.variables);
        }
        return combineLatest(
          this.diseaseService
            .fetchDiseases(FETCHDISEASEQUERY, DISEASEQUERYPARAMETERS)
            .pipe(take(1)),
          this.diseaseService
            .fetchArticles(FETCHARTICLESQUERY, NONEPIARTICLES)
            .pipe(take(1)),
          this.diseaseService
            .fetchArticles(FETCHARTICLESQUERY, EPIARTICLES)
            .pipe(take(1)),
          this.diseaseService
            .fetchProjects(FETCHPROJECTSQUERY, PROJECTVARIABLES)
            .pipe(take(1)),
          this.diseaseService
            .fetchTrials(FETCHTRIALSQUERY, FETCHTRIALSVARIABLES)
            .pipe(take(1))
        ).pipe(
          map(
            ([
              diseaseData,
              articleData,
              epiArticleData,
              projectsData,
              trialsData,
            ]: [
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>
            ]) => {
              console.log(trialsData)
              if (diseaseData && diseaseData.data) {
                const diseaseObj: Disease = this._makeDiseaseObj(
                  diseaseData,
                  articleData,
                  epiArticleData,
                  projectsData,
                  trialsData
                );
                return DiseasesActions.fetchDiseaseSuccess({
                  disease: diseaseObj,
                });
              } else
                return DiseasesActions.fetchDiseaseFailure({
                  error: 'No Disease found',
                });
            }
          )
        );
      })
    )
  );
*/
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadDisease$ = createEffect((): any =>
    inject(Actions).pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/diseases') &&
          r.payload.routerState.url.startsWith('/disease')
      ),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      switchMap((root: ActivatedRouteSnapshot) => {
        const params = root.queryParams;
        const gardid: string = params['id'];
        this._setGardId(gardid);

        if (root.fragment) {
          this._setFragment(root.fragment, params as DEFAULTOPTIONS);
        }
        return combineLatest(
          this.diseaseService
            .fetchDiseases(FETCHDISEASEQUERY, DISEASEQUERYPARAMETERS)
            .pipe(take(1)),
          this.diseaseService
            .fetchArticles(FETCHARTICLESQUERY, NONEPIARTICLES)
            .pipe(take(1)),
          this.diseaseService
            .fetchArticles(FETCHARTICLESQUERY, EPIARTICLES)
            .pipe(take(1)),
          this.diseaseService
            .fetchProjects(FETCHPROJECTSQUERY, PROJECTVARIABLES)
            .pipe(take(1)),
          this.diseaseService
            .fetchTrials(FETCHTRIALSQUERY, FETCHTRIALSVARIABLES)
            .pipe(take(1))
        ).pipe(
          map(
            ([
              diseaseData,
              articleData,
              epiArticleData,
              projectsData,
              trialsData,
            ]: [
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>
            ]) => {
              if (diseaseData && diseaseData.data) {
                const diseaseObj: Disease = this._makeDiseaseObj(
                  diseaseData,
                  articleData,
                  epiArticleData,
                  projectsData,
                  trialsData
                );
                return DiseasesActions.fetchDiseaseSuccess({
                  disease: diseaseObj,
                });
              } else
                return DiseasesActions.fetchDiseaseFailure({
                  error: 'No Disease found',
                });
            }
          )
        );
      })
    )
  );



  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadDiseaseFilters$ = createEffect((): any =>
    inject(Actions).pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (r: RouterNavigationAction) =>
          !r.payload.routerState.url.includes('/diseases') &&
          r.payload.routerState.url.startsWith('/disease')
      ),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      switchMap((root: ActivatedRouteSnapshot) => {
        const params: Params = root.queryParams;
        const gardid: string = params['id'];
        this._setGardId(gardid);

        if (root.fragment) {
          this._setFragment(root.fragment, {
            limit: params['limit'],
            offset: params['offset'],
          });
        }
        return combineLatest(
          this.diseaseService
            .fetchArticles(ARTICLEFILTERS, { gardId: gardid})
            .pipe(take(1)),
          this.diseaseService
            .fetchProjects(PROJECTFILTERS, { gardId: gardid})
            .pipe(take(1)),
          this.diseaseService
            .fetchTrials(TRIALFILTERS, FETCHTRIALSVARIABLES)
            .pipe(take(1)),
        )
          .pipe(
            map(
              ([
                 articleFilterData,
                 projectFilterData,
                 trialFilterData
               ]: [
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ApolloQueryResult<any>,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ApolloQueryResult<any>,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ApolloQueryResult<any>
              ]) => {
                const filters: FilterCategory[] = []
                if (articleFilterData && articleFilterData.data) {
                  if(articleFilterData.data.countsByYear.length) {
                  filters.push(new FilterCategory(
                      {
                        parent: 'articles',
                        label: "Articles by Year",
                        values: articleFilterData.data.countsByYear.map((fil: Partial<Filter>) => new Filter(fil))
                      }
                    ))
                  }
                  if (projectFilterData && projectFilterData.data) {
                    if (projectFilterData.data.countsByYear.length) {
                      filters.push(new FilterCategory(
                        {
                          parent: 'projects',
                          label: "Projects Count by Year",
                          values: projectFilterData.data.countsByYear.map((fil: Partial<Filter>) => new Filter(fil))
                        }
                      ))
                    }
                    if (projectFilterData.data.costByYear.length) {
                      filters.push(new FilterCategory(
                        {
                          parent: 'projects',
                          label: "Projects Funding by Year",
                          values: projectFilterData.data.costByYear.map((fil: Partial<Filter>) => new Filter(fil))
                        }
                      ))
                    }
                  }
                  if (trialFilterData && trialFilterData.data) {
                    if (trialFilterData.data.trialsByStatus.length) {
                      filters.push(new FilterCategory(
                        {
                          parent: 'trials',
                          label: "Clinical Trials by Status",
                          values: trialFilterData.data.trialsByStatus.map((fil: Partial<Filter>) => new Filter({...fil, selected:
                            params['OverallStatus'] === fil.term || params['OverallStatus']?.includes(fil.term)
                      }))
                        }
                      ))
                    }
                    if (trialFilterData.data.trialsByType.length) {
                      filters.push(new FilterCategory(
                        {
                          parent: 'trials',
                          label: "Clinical Trials by Type",
                          values: trialFilterData.data.trialsByType.map((fil: Partial<Filter>) => new Filter(fil))
                        }
                      ))
                    }
                  }

                  return DiseasesActions.fetchDiseaseFiltersSuccess({
                    filters: filters,
                  });
                } else
                  return DiseasesActions.fetchDiseaseFiltersFailure({
                    error: 'No Disease found',
                  });
              }
            )
          );
      })
    )
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchTreeBranch$ = createEffect((): any =>
    inject(Actions).pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) =>
        r.payload.routerState.url.startsWith('/diseases')
      ),
      map(
        (r: RouterNavigationAction) => r.payload.routerState.root.queryParams
      ),
      concatLatestFrom(() =>
        this.store.select(fromDiseasesSelectors.getDiseaseTree)
      ),
      switchMap(([params, tree]) => {
        let query;
        let qParams: any;
        if (!tree) {
          if (params['parentId']) {
            //   console.log("no tree, maybe page, parent id")
            query = FETCHPATH;
            qParams = { searchString: params['parentId'] };
            if (params['phenotypes']) {
              qParams.where = {
                hasPhenotypePhenotypes_SOME: {
                  HPOTerm_IN: params['phenotypes'].split('&'),
                },
              };
            }
          } else {
            //   console.log("no tree, maybe page, no parent id")
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
            //  console.log("tree, page, no parent id")
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
              //   console.log("tree, no page, parent id")
              DISEASEQUERYPARAMETERS.where = { GardId: params['parentId'] };
              if (params['phenotypes']) {
                DISEASEQUERYPARAMETERS.where.hasPhenotypePhenotypes_SOME = {
                  HPOTerm_IN: params['phenotypes'].split('&'),
                };
              }
              query = CATEGORYTREEBRANCH;
              qParams = DISEASEQUERYPARAMETERS;
            } else {
              //   console.log("tree, no page, no parent id")
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

        return this.diseaseService.fetchDiseases(query, qParams).pipe(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map((res: any) => {
            if (res && res.data) {
              let diseaseArr;
              if (res.data.treeBranch) {
                diseaseArr = res.data.treeBranch[0].nodes
                  .map((obj: Partial<DiseaseNode>) => new DiseaseNode(obj))
                  .sort(
                    (a: DiseaseNode, b: DiseaseNode) =>
                      b.childrenCount - a.childrenCount
                  );
              } else if (tree) {
                diseaseArr = this._addToTree(res.data.diseases[0], tree);
              } else if (res.data.diseases) {
                diseaseArr = res.data.diseases
                  .map((obj: Partial<DiseaseNode>) => new DiseaseNode(obj))
                  .sort(
                    (a: DiseaseNode, b: DiseaseNode) =>
                      b.childrenCount - a.childrenCount
                  );
              }
              return DiseasesActions.loadDiseaseTreeSuccess({
                diseases: diseaseArr,
              });
            } else
              return DiseasesActions.loadDiseaseTreeFailure({
                error: 'No Disease found',
              });
          })
        );
      })
    )
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadDiseaseList$ = createEffect((): any =>
    inject(Actions).pipe(
      ofType(DiseasesActions.fetchDiseaseList),
      mergeMap((action: { gardIds: string[] }) => {
        return this.diseaseService
          .fetchDiseases(DISEASELIST, { where: { GardId_IN: action.gardIds } })
          .pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((res: any) => {
              if (res && res.data) {
                const diseaseArr: Disease[] = res.data.diseases.map(
                  (obj: Partial<Disease>) => new Disease(obj)
                );
                return DiseasesActions.fetchDiseaseListSuccess({
                  diseases: diseaseArr,
                });
              } else
                return DiseasesActions.fetchDiseaseListFailure({
                  error: 'No Disease found',
                });
            })
          );
      })
    )
  );

  'where': {
    GardId_IN: null;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isLoadingDisease$ = createEffect((): any =>
    inject(Actions).pipe(
      ofType(DiseasesActions.fetchDisease),
      mergeMap(() => {
        return of(DiseasesActions.loading());
      })
    )
  );

  isLoadingDiseaseList$ = createEffect((): any =>
    inject(Actions).pipe(
      ofType(ROUTER_NAVIGATION),
      mergeMap(() => {
        return of(DiseasesActions.loading());
      })
    )
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _makeDiseaseObj(
    diseaseData: any,
    articleData?: any,
    epiArticleData?: any,
    projectsData?: any,
    trialsData?: any
  ): Disease {
    if (diseaseData) {
      const diseaseObj: Disease = new Disease(diseaseData.data.disease[0]);
      if (articleData && articleData.data && articleData.data.articles.length) {
        if (
          articleData.data.articles[0] &&
          articleData.data.articles[0].articles.length
        ) {
          diseaseObj.nonEpiArticles = articleData.data.articles[0].articles.map(
            (art: Partial<Article>) => new Article(art)
          );
          diseaseObj.nonEpiCount = articleData.data.articles[0]._count.count;
        }
      }
      if (
        epiArticleData &&
        epiArticleData.data &&
        epiArticleData.data.articles.length
      ) {
        if (
          epiArticleData.data.articles[0] &&
          epiArticleData.data.articles[0].articles.length
        ) {
          diseaseObj.epiArticles = epiArticleData.data.articles[0].articles.map(
            (art: Partial<Article>) => new Article(art)
          );
          diseaseObj.epiCount = epiArticleData.data.articles[0]._count.count;
        }
      }
      if (projectsData.data && projectsData.data.coreProjects.length) {
        diseaseObj.projects = projectsData.data.coreProjects.map(
          (proj: Partial<CoreProject>) => new CoreProject(proj)
        );
        diseaseObj.projectCount = projectsData.data.count.count;
      }
      if (trialsData.data && trialsData.data.clinicalTrials.length) {
        diseaseObj.clinicalTrials = trialsData.data.clinicalTrials.map(
          (trial: Partial<ClinicalTrial>) => new ClinicalTrial(trial)
        );
        diseaseObj.clinicalTrialCount = trialsData.data.count.count;
      }
      return diseaseObj;
    } else return new Disease({});
  }

  _addToTree(data: DiseaseNode, parent?: DiseaseNode[] | undefined) {
    let ret;
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
          (a, b) => b.childrenCount - a.childrenCount
        );
      } else {
        parent.some((disease) => {
          if (disease.children) {
            const lll = this._addToTree(dNode, disease.children);
            const d2: DiseaseNode = new DiseaseNode({
              ...disease,
              children: lll,
            });
            diseaseMap.set(d2.gardId, d2);
            ret = [...diseaseMap.values()].sort(
              (a, b) => b.childrenCount - a.childrenCount
            );
          }
        });
      }
      return ret;
    }
  }

  _setFragment(
    origin: string | null,
    options: DEFAULTOPTIONS
  ) {
    switch (origin) {
      case 'epiArticles': {
        EPIARTICLES.articleOptions.limit = options.limit ? options.limit : 10;
        if (options.offset) {
          EPIARTICLES.articleOptions.offset = options.offset * 1;
        }
        break;
      }
      case 'nonEpiArticles': {
        NONEPIARTICLES.articleOptions.limit = options.limit ? options.limit : 10;
        if (options.offset) {
          NONEPIARTICLES.articleOptions.offset = options.offset * 1;
        }
        break;
      }
      case 'project': {
        PROJECTVARIABLES.coreProjectsOptions.limit = options.limit ? options.limit : 10;
        if (options.offset) {
          PROJECTVARIABLES.coreProjectsOptions.offset = options.offset * 1;
        }
        break;
      }
      case 'trials': {
        FETCHTRIALSVARIABLES.ctoptions.limit = options.limit ? options.limit : 10;
        if (options.offset) {
          FETCHTRIALSVARIABLES.ctoptions.offset = options.offset * 1;
        }
        if (options['GardId']) {
            FETCHTRIALSVARIABLES.ctwhere.investigatesConditionConditions_SOME.hasAnnotationAnnotations_SOME.mappedToGardGards_SOME.GardId = <string>options['GardId']
        }
        if (options.OverallStatus) {
          if(options.OverallStatus.length) {
            FETCHTRIALSVARIABLES.ctwhere.OverallStatus_IN = options.OverallStatus;
          } else {
            FETCHTRIALSVARIABLES.ctwhere.OverallStatus_IN = undefined;
          }
        }
        if (options.StudyType) {
          if(options.StudyType.length) {
            FETCHTRIALSVARIABLES.ctwhere.StudyType_IN = options.StudyType;
          } else {
            FETCHTRIALSVARIABLES.ctwhere.StudyType_IN = undefined;
          }
        }
        break;
      }
    }
  }

  _setGardId(gardid: string) {
    DISEASEQUERYPARAMETERS.where = { GardId: gardid };
    EPIARTICLES.gardWhere.GardId = gardid;
    NONEPIARTICLES.gardWhere.GardId = gardid;
    PROJECTVARIABLES.coreProjectsWhere.projectsUnderCore_SOME.gardsresearchedBy_SOME.GardId = gardid;
    FETCHTRIALSVARIABLES.ctwhere.investigatesConditionConditions_SOME.hasAnnotationAnnotations_SOME.mappedToGardGards_SOME.GardId = gardid;
  }

  constructor(
    private diseaseService: DiseaseService,
    private store: Store
  ) {}
}
