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
import { Store } from "@ngrx/store";
import { DiseaseService } from '../disease.service';
import { createEffect, Actions, ofType, concatLatestFrom } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import {
  combineLatest,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  take
} from "rxjs";
import * as DiseasesActions from './diseases.actions';
import * as fromDiseasesSelectors from './diseases.selectors';

@Injectable()
export class DiseasesEffects {
  searchDiseases = createEffect(() =>
    inject(Actions).pipe(
      ofType(DiseasesActions.searchDiseases),
      mergeMap((action: { term: string }) => {
        return this.diseaseService
          .fetchDiseases(DISEASETYPEAHEAD, { searchString: action.term + '~', limit: 10 })
          .pipe(
            map((res: ApolloQueryResult<unknown>) => {
              const data: {diseaseSearch: Disease[]} = res.data as {diseaseSearch: Disease[]};
              if (data) {
                const diseaseArr = data.diseaseSearch.map(
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

  loadDiseases$ = createEffect(() =>
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
            map((res: ApolloQueryResult<unknown>) => {
              const data: {diseases: Disease[], total: {count: number} | number} = res.data as {diseases: Disease[],  total: {count: number} | number};
              if (data) {
                let page: Page;
                if (typeof data.total !== "number") {
                   page = {
                    pageSize: pageSize,
                    pageIndex: pageIndex,
                    total: data.total.count
                  } as Page;
                } else {
                  page = {
                    pageSize: pageSize,
                    pageIndex: pageIndex,
                    total: data.total
                  } as Page;
                }
                const diseaseArr: Disease[] = data.diseases.map(
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

   loadDisease$ = createEffect(() =>
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
       //   console.log("from load disease")
          this._setFragment(root.fragment, params);
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



  loadDiseaseFilters$ = createEffect(() =>
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
       //   console.log("from filters")
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
                ApolloQueryResult<unknown>,
                ApolloQueryResult<unknown>,
                ApolloQueryResult<unknown>
              ]) => {
                const filters: FilterCategory[] = []
                if (articleFilterData) {
                    const articleFilterDataList: {countsByYear: Filter[]} = articleFilterData.data as {countsByYear: Filter[]};
                    if (articleFilterDataList.countsByYear.length) {
                  filters.push(new FilterCategory(
                      {
                        parent: 'articles',
                        label: "Articles by Year",
                        filterable: false,
                        values: articleFilterDataList.countsByYear.map((fil: Partial<Filter>) => new Filter(fil))
                      }
                    )
                  )
                  filters.push(new FilterCategory(
                      {
                        parent: 'epiArticles',
                        label: "Epidemiology Articles by Year",
                        values: articleFilterDataList.countsByYear
                          .filter((year: Partial<Filter>) => year.label == 'Epidemiology Articles')
                          .map((fil: Partial<Filter>) => new Filter({...fil, label: 'year'}))
                      }
                    )
                  )
                filters.push(new FilterCategory(
                      {
                        parent: 'nonEpiArticles',
                        label: "Articles by Year",
                        values: articleFilterDataList.countsByYear
                          .filter((year: Partial<Filter>) => year.label == 'Non Epidemiology Articles')
                          .map((fil: Partial<Filter>) => new Filter({...fil, label: 'year'})) }
                    ))
                  }
                    if (projectFilterData) {
                      const projectFilterDataList: {countsByYear: Filter[], costByYear: Filter[]} = projectFilterData.data as {countsByYear: Filter[], costByYear: Filter[]};
                    if (projectFilterDataList.countsByYear.length) {
                      filters.push(new FilterCategory(
                        {
                          parent: 'projects',
                          label: "Projects Count by Year",
                          filterable: false,
                          values: projectFilterDataList.countsByYear.map((fil: Partial<Filter>) => new Filter(fil))
                        }
                      ))
                    }
                    if (projectFilterDataList.costByYear.length) {
                      filters.push(new FilterCategory(
                        {
                          parent: 'projects',
                          label: "Projects Funding by Year",
                          filterable: false,
                          values: projectFilterDataList.costByYear.map((fil: Partial<Filter>) => new Filter(fil))
                        }
                      ))
                    }
                  }
                  if (trialFilterData) {
                    const trialFilterDataList: {trialsByStatus: Filter[], trialsByType: Filter[]} = trialFilterData.data as {trialsByStatus: Filter[], trialsByType: Filter[]};
                        if (trialFilterDataList.trialsByStatus) {
                      filters.push(new FilterCategory(
                        {
                          parent: 'trials',
                          label: "Clinical Trials by Status",
                          values: trialFilterDataList.trialsByStatus.map((fil: Partial<Filter>) => new Filter({...fil, selected:
                            params['OverallStatus'] === fil.term || params['OverallStatus']?.includes(fil.term)
                      }))
                        }
                      ))
                    }
                    if (trialFilterDataList.trialsByType.length) {
                      filters.push(new FilterCategory(
                        {
                          parent: 'trials',
                          label: "Clinical Trials by Type",
                          values: trialFilterDataList.trialsByType.map((fil: Partial<Filter>) => new Filter(fil))
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

  fetchTreeBranch$ = createEffect(() =>
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
        let qParams: {[key: string]: unknown} | undefined;
        if (!tree) {
          if (params['parentId']) {
            //   console.log("no tree, maybe page, parent id")
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
            map((res: ApolloQueryResult<unknown>) => {
              const data: {treeBranch: {nodes: DiseaseNode[]}[], diseases: DiseaseNode[]}
                = res.data as {treeBranch: {nodes: DiseaseNode[]}[], diseases: DiseaseNode[]};
              let diseaseArr: DiseaseNode[] = [] as DiseaseNode[];
            if (data) {
              if (data.treeBranch) {
                diseaseArr = data.treeBranch[0].nodes
                  .map((obj: Partial<DiseaseNode>) => new DiseaseNode(obj))
                  .sort(
                    (a: DiseaseNode, b: DiseaseNode) =>
                      b.childrenCount - a.childrenCount
                  );
              } else if (tree) {
                diseaseArr = this._addToTree(data.diseases[0], tree);
              } else if (data.diseases) {
                diseaseArr = data.diseases
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

  loadDiseaseList$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(DiseasesActions.fetchDiseaseList),
      mergeMap((action: { gardIds: string[] }) => {
        return this.diseaseService
          .fetchDiseases(DISEASELIST, { where: { GardId_IN: action.gardIds } })
          .pipe(
            map((res: ApolloQueryResult<unknown>) => {
              const data: {diseases: DiseaseNode[]} = res.data as {diseases: DiseaseNode[]};
              if (data) {
                const diseaseArr: Disease[] = data.diseases.map(
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

  isLoadingDisease$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(DiseasesActions.fetchDisease),
      mergeMap(() => {
        return of(DiseasesActions.loading());
      })
    )
  );

  isLoadingDiseaseList$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(ROUTER_NAVIGATION),
      mergeMap(() => {
        return of(DiseasesActions.loading());
      })
    )
  );

  _makeDiseaseObj(
    diseaseData: ApolloQueryResult<unknown>,
    articleData?: ApolloQueryResult<unknown>,
    epiArticleData?: ApolloQueryResult<unknown>,
    projectsData?: ApolloQueryResult<unknown>,
    trialsData?: ApolloQueryResult<unknown>
  ): Disease {
    const disease: {disease: Disease[]} = diseaseData.data as {disease: Disease[]};
    if (disease) {
      const diseaseObj: Disease = new Disease(disease.disease[0]);
      if (articleData) {
        const articles: {articles: {articles: Article[], _count: { count: number }}[]}  =
          articleData.data as {articles: {articles: Article[], _count: {count: number}}[]};
        if (articles) {
          diseaseObj.nonEpiArticles = articles.articles[0].articles.map(
            (art: Partial<Article>) => new Article(art)
          );
          diseaseObj.nonEpiCount = articles.articles[0]._count.count;
        }
      }
      if (epiArticleData) {
        const epiArticles: {articles: {articles: Article[], _count: { count: number }}[] } = epiArticleData.data as {articles: {articles: Article[], _count: { count: number }}[] };
        if (epiArticles) {
          diseaseObj.epiArticles = epiArticles.articles[0].articles.map(
            (art: Partial<Article>) => new Article(art)
          );
          diseaseObj.epiCount = epiArticles.articles[0]._count.count;
        }
      }
      if (projectsData) {
        const projects: {coreProjects: CoreProject[], count: { count: number }} = projectsData.data as {coreProjects: CoreProject[], count: { count: number }};
        diseaseObj.projects = projects.coreProjects.map(
          (proj: Partial<CoreProject>) => new CoreProject(proj)
        );
        diseaseObj.projectCount = projects.count.count;
      }
      if (trialsData) {
        const trials: {clinicalTrials: ClinicalTrial[], count: { count: number }} = trialsData.data as {clinicalTrials: ClinicalTrial[], count: { count: number }};
        diseaseObj.clinicalTrials = trials.clinicalTrials.map(
          (trial: Partial<ClinicalTrial>) => new ClinicalTrial(trial)
        );
        diseaseObj.clinicalTrialCount = trials.count.count;
      }
      return diseaseObj;
    } else return new Disease({});
  }

  _addToTree(data: DiseaseNode, parent?: DiseaseNode[] | undefined): DiseaseNode[] {
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
    options: {
      limit?: number,
      offset?: number,
      year?: string| string[];
      GardId?: string,
      OverallStatus?: string[];
      StudyType?: string[];
    }
  ) {
    switch (origin) {
      case 'epiArticles': {
        EPIARTICLES.articleOptions.limit = <number>options['limit'] ? <number>options['limit'] : 10;
        if (<number>options['offset']) {
          EPIARTICLES.articleOptions.offset = <number>options['offset'] * 1;
        }
        if(options['year'] && options['year'].length > 0) {
          EPIARTICLES.articleWhere.publicationYear_IN = options['year'];
        } else {
          EPIARTICLES.articleWhere.publicationYear_IN =undefined;
        }
        break;
      }
      case 'nonEpiArticles': {
        NONEPIARTICLES.articleOptions.limit = <number>options['limit'] ? <number>options['limit'] : 10;
        if (<number>options['offset']) {
          NONEPIARTICLES.articleOptions.offset = <number>options['offset'] * 1;
        }
        if(options['year'] && options['year'].length > 0) {
          NONEPIARTICLES.articleWhere.publicationYear_IN = options['year'];
        } else {
          NONEPIARTICLES.articleWhere.publicationYear_IN = undefined;
        }
        break;
      }
      case 'project': {
        PROJECTVARIABLES.coreProjectsOptions.limit = <number>options['limit'] ? <number>options['limit'] : 10;
        if (<number>options['offset']) {
          PROJECTVARIABLES.coreProjectsOptions.offset = <number>options['offset'] * 1;
        }
        break;
      }
      case 'trials': {
        FETCHTRIALSVARIABLES.ctoptions.limit = <number>options['limit'] ? <number>options['limit'] : 10;
        if (<number>options['offset']) {
          FETCHTRIALSVARIABLES.ctoptions.offset = <number>options['offset'] * 1;
        }
        if (options['GardId']) {
            FETCHTRIALSVARIABLES.ctwhere.investigatesConditionConditions_SOME.hasAnnotationAnnotations_SOME.mappedToGardGards_SOME.GardId = <string>options['GardId']
        }
        if (options['OverallStatus'] && options['OverallStatus'].length > 0) {
            FETCHTRIALSVARIABLES.ctwhere.OverallStatus_IN = options['OverallStatus'];
          } else {
          FETCHTRIALSVARIABLES.ctwhere.OverallStatus_IN = undefined;
          }
        if (options['StudyType'] && options['StudyType'].length > 0) {
            FETCHTRIALSVARIABLES.ctwhere.StudyType_IN = options['StudyType'];
          } else {
            FETCHTRIALSVARIABLES.ctwhere.StudyType_IN = undefined;
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
