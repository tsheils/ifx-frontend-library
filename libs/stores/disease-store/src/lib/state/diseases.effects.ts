import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from "@angular/router";
import { ApolloQueryResult } from "@apollo/client";
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
  PHENOTYPEPARAMETERS,
  FETCHPHENOTYPES, SEARCHPHENOTYPES, FETCHFILTEREDPHENOTYPES
} from "@ncats-frontend-library/models/rdas";
import { Filter, FilterCategory, Page } from "@ncats-frontend-library/models/utils";
import { Store } from "@ngrx/store";
import { DiseaseService } from "../disease.service";
import { createEffect, Actions, ofType, concatLatestFrom } from "@ngrx/effects";
import {ROUTER_NAVIGATION, RouterNavigationAction} from "@ngrx/router-store";
import {
  combineLatest,
  filter,
  forkJoin,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchDiseases = createEffect((): any =>
    this.actions$.pipe(
      ofType(DiseasesActions.searchDiseases),
      mergeMap((action: {term: string}) => {
        return this.diseaseService.fetchDiseases(DISEASETYPEAHEAD, { searchString: action.term + '~' })
          .pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((res: any) => {
              if (res.data && res.data.diseaseSearch) {
                const diseaseArr = res.data.diseaseSearch.map((obj: Partial<Disease>) => new Disease(obj))
                return DiseasesActions.searchDiseasesSuccess({ typeahead: diseaseArr })
              } else return DiseasesActions.searchDiseasesFailure({ error: "No Diseases found" })
            })
          )
      })
    )
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadDiseases$ = createEffect((): any => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) =>  r.payload.routerState.url.startsWith('/diseases')),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      switchMap((params: { pageSize?: number, pageIndex?: number, parentId?: string, sort?: string, direction?: string, phenotypes?: string}) => {
        let query;
        let queryParams;
        const pageSize: number = params.pageSize ? params.pageSize as number: 10;
        const pageIndex: number = params.pageIndex ? params.pageIndex as number : 0;

        if(params.parentId) {
          DISEASEBRANCHPARAMETERS.searchString = params.parentId;
            DISEASEBRANCHPARAMETERS.limit = +pageSize;
            DISEASEBRANCHPARAMETERS.skip = +pageSize * (+pageIndex);
          query = FETCHPATHDISEASES
          queryParams = DISEASEBRANCHPARAMETERS
        } else {
          LISTQUERYPARAMETERS.options.limit =  +pageSize;
          LISTQUERYPARAMETERS.options.offset = +pageSize * (+pageIndex +1);
          if(params.sort) {
            LISTQUERYPARAMETERS.options.sort = [{
              [params.sort]: params.direction ? params.direction : "DESC"
            }]
          }
          queryParams = LISTQUERYPARAMETERS
          query = FETCHDISEASESLISTQUERY
        }
        if(params.phenotypes) {
          queryParams.where = {hasPhenotypePhenotypes_SOME: {HPOTerm_IN: params.phenotypes.split("&")}}
        }
        return this.diseaseService.fetchDiseases(query, queryParams)
          .pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((res: any) => {
              if(res && res.data) {
                const page: Page = { pageSize: pageSize, pageIndex: pageIndex, total: res.data.total.count ? res.data.total.count : res.data.total}
                const diseaseArr: Disease[] = res.data.diseases.map((obj: Partial<Disease>) => new Disease(obj))
                return DiseasesActions.loadDiseasesSuccess({diseases: diseaseArr, page: page})
              }
              else return DiseasesActions.loadDiseasesFailure({error: "No Disease found"})
            })
          )
      })
    )}
  );

  //paginate through disease sub-sections (projects, publications, clinical trials)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchDisease = createEffect((): any =>
    this.actions$.pipe(
      ofType(DiseasesActions.fetchDisease),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mergeMap((action: any) => {
        if(action.fragment) {
          this._setFragment(action.origin, action.variables)
        }
        return combineLatest(
          this.diseaseService.fetchDiseases(FETCHDISEASEQUERY, DISEASEQUERYPARAMETERS).pipe(take(1)),
          this.diseaseService.fetchArticles(FETCHARTICLESQUERY, NONEPIARTICLES).pipe(take(1)),
          this.diseaseService.fetchArticles(FETCHARTICLESQUERY, EPIARTICLES).pipe(take(1)),
          this.diseaseService.fetchProjects(FETCHPROJECTSQUERY, PROJECTVARIABLES).pipe(take(1)),
          this.diseaseService.fetchTrials(FETCHTRIALSQUERY, FETCHTRIALSVARIABLES).pipe(take(1))
        )
          .pipe(
            map(([diseaseData, articleData, epiArticleData, projectsData, trialsData]: [ApolloQueryResult<unknown>, ApolloQueryResult<unknown>, ApolloQueryResult<unknown>, ApolloQueryResult<unknown>, ApolloQueryResult<unknown>]) => {
              if(diseaseData && diseaseData.data) {
                const diseaseObj: Disease = this._makeDiseaseObj(diseaseData, articleData, epiArticleData, projectsData, trialsData);
                return DiseasesActions.fetchDiseaseSuccess({disease: diseaseObj})
              }
              else return DiseasesActions.fetchDiseaseFailure({error: "No Disease found"})
            })
          )
      })
    )
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadDisease$ = createEffect((): any =>
     this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) => !r.payload.routerState.url.includes('/diseases') && r.payload.routerState.url.startsWith('/disease')),
      map((r: RouterNavigationAction) => r.payload.routerState.root),
      switchMap((root: ActivatedRouteSnapshot) => {
        const params = root.queryParams;
        const gardid = params['id']
        DISEASEQUERYPARAMETERS.where = {GardId: gardid};
        EPIARTICLES.gardWhere.GardId =  gardid;
        NONEPIARTICLES.gardWhere.GardId =  gardid;
        PROJECTVARIABLES.coreProjectsWhere = {projectsUnderCoreConnection_ALL: {node: {gardsresearchedBy_SINGLE: {GardId: gardid}}}};
         FETCHTRIALSVARIABLES.gardId = gardid;
        if(root.fragment){
          this._setFragment(root.fragment, {limit: params['limit'], offset: params['offset']})
        }
        return forkJoin(
          this.diseaseService.fetchDiseases(FETCHDISEASEQUERY, DISEASEQUERYPARAMETERS).pipe(take(1)),
          this.diseaseService.fetchArticles(FETCHARTICLESQUERY, NONEPIARTICLES).pipe(take(1)),
          this.diseaseService.fetchArticles(FETCHARTICLESQUERY, EPIARTICLES).pipe(take(1)),
          this.diseaseService.fetchProjects(FETCHPROJECTSQUERY, PROJECTVARIABLES).pipe(take(1)),
          this.diseaseService.fetchTrials(FETCHTRIALSQUERY, FETCHTRIALSVARIABLES).pipe(take(1))
        )
          .pipe(
            map(([diseaseData, articleData, epiArticleData, projectsData, trialsData]: [ApolloQueryResult<unknown>,
              ApolloQueryResult<unknown>, ApolloQueryResult<unknown>,ApolloQueryResult<unknown>, ApolloQueryResult<unknown>]) => {
              if(diseaseData && diseaseData.data) {
                const diseaseObj: Disease = this._makeDiseaseObj(diseaseData, articleData, epiArticleData, projectsData, trialsData);
                return DiseasesActions.fetchDiseaseSuccess({disease: diseaseObj})
              }
              else return DiseasesActions.fetchDiseaseFailure({error: "No Disease found"})
            })
          )
      })
    )
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchTreeBranch$ = createEffect((): any =>
     this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
     filter((r: RouterNavigationAction) => r.payload.routerState.url.startsWith('/diseases')),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      concatLatestFrom(() => this.store.select(fromDiseasesSelectors.getDiseaseTree)),
      switchMap(([params, tree]) => {
        let query;
        let qParams: any;
        if(!tree) {
          if(params["parentId"]) {
         //   console.log("no tree, maybe page, parent id")
            query = FETCHPATH;
            qParams = { searchString: params["parentId"] };
            if(params['phenotypes']) {
              qParams.where = { hasPhenotypePhenotypes_SOME: { HPOTerm_IN: params['phenotypes'].split("&") } }
            }
          } else {
         //   console.log("no tree, maybe page, no parent id")
            query = FETCHROOT;
            qParams = params['phenotypes'] ? {where: { hasPhenotypePhenotypes_SOME: { HPOTerm_IN: params['phenotypes'].split("&") }}} : undefined;
          }
        } else {
          if(params["pageIndex"]) {
          //  console.log("tree, page, no parent id")
            query = FETCHROOT;
            qParams = params['phenotypes'] ? {where: { hasPhenotypePhenotypes_SOME: { HPOTerm_IN: params['phenotypes'].split("&") }}} : undefined;
          } else {
            if(params["parentId"]) {
           //   console.log("tree, no page, parent id")
              DISEASEQUERYPARAMETERS.where = { GardId: params["parentId"] };
              if(params['phenotypes']){
                DISEASEQUERYPARAMETERS.where.hasPhenotypePhenotypes_SOME =  {HPOTerm_IN: params['phenotypes'].split("&")};
              }
              query = CATEGORYTREEBRANCH;
              qParams = DISEASEQUERYPARAMETERS;
            } else {
           //   console.log("tree, no page, no parent id")
              query = FETCHROOT;
              qParams = params['phenotypes'] ? {where: { hasPhenotypePhenotypes_SOME: { HPOTerm_IN: params['phenotypes'].split("&") }}} : undefined;
            }
          }
        }

        return this.diseaseService.fetchDiseases(query, qParams )
          .pipe(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map((res: any) => {
              if(res && res.data) {
                let diseaseArr;
                if(res.data.treeBranch) {
                   diseaseArr = res.data.treeBranch[0].nodes
                    .map((obj: Partial<DiseaseNode>) => new DiseaseNode(obj))
                    .sort((a: DiseaseNode, b: DiseaseNode) => b.childrenCount - a.childrenCount)
                } else if(tree) {
                  diseaseArr = this._addToTree(res.data.diseases[0], tree);
                } else if (res.data.diseases) {
                  diseaseArr = res.data.diseases
                    .map((obj: Partial<DiseaseNode>) => new DiseaseNode(obj))
                    .sort((a: DiseaseNode, b: DiseaseNode) => b.childrenCount - a.childrenCount)
                }
                return DiseasesActions.loadDiseaseTreeSuccess({diseases: diseaseArr})
              }
              else return DiseasesActions.loadDiseaseTreeFailure({error: "No Disease found"})
            })
          )
      })
    )
  );


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isLoadingDisease$ = createEffect((): any =>
       this.actions$.pipe(
        ofType(DiseasesActions.fetchDisease),
        mergeMap(() => {
          return of(DiseasesActions.loading());
        })
      )
    );

  isLoadingDiseaseList$ = createEffect((): any =>
       this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        mergeMap(() => {
          return of(DiseasesActions.loading());
        })
      )
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _makeDiseaseObj(diseaseData: any, articleData?: any, epiArticleData?: any, projectsData?: any, trialsData?: any): Disease {
    if (diseaseData ) {
      const diseaseObj: Disease = new Disease(diseaseData.data.disease[0]);
      if (articleData && articleData.data && articleData.data.articles.length) {
        if (articleData.data.articles[0] && articleData.data.articles[0].articles.length) {
          diseaseObj.nonEpiArticles = articleData.data.articles[0].articles.map((art: Partial<Article>) => new Article(art))
          diseaseObj.nonEpiCount = articleData.data.articles[0]._count.count;
        }
      }
      if (epiArticleData && epiArticleData.data && epiArticleData.data.articles.length) {
        if (epiArticleData.data.articles[0] && epiArticleData.data.articles[0].articles.length) {
          diseaseObj.epiArticles = epiArticleData.data.articles[0].articles.map((art: Partial<Article>) => new Article(art))
          diseaseObj.epiCount = epiArticleData.data.articles[0]._count.count;
        }
      }
      if (projectsData.data && projectsData.data.coreProjects.length) {
        diseaseObj.projects = projectsData.data.coreProjects.map((proj: Partial<CoreProject>) => new CoreProject(proj))
        diseaseObj.projectCount = projectsData.data.count.count;
      }
      if (trialsData.data && trialsData.data.clinicalTrials.length) {
        diseaseObj.clinicalTrials = trialsData.data.clinicalTrials.map((trial: Partial<ClinicalTrial>) => new ClinicalTrial(trial))
        diseaseObj.clinicalTrialCount = trialsData.data.count;
      }
      return diseaseObj;
    } else return new Disease({});
  }

  _addToTree(data: DiseaseNode, parent?: DiseaseNode[]|undefined) {
    let ret;
    const dNode = new DiseaseNode(data);
    if (!parent) {
      return [data];
    } else {
      const diseaseMap = new Map<string, DiseaseNode>();
      let found = false;
      parent.map(disease => {
        if (disease.gardId === dNode.gardId) {
          found = true;
          diseaseMap.set(dNode.gardId, dNode)
        } else {
          diseaseMap.set(disease.gardId, disease)
        }
      })
      if (found) {
        ret = [...diseaseMap.values()].sort((a, b) => b.childrenCount - a.childrenCount);
      } else {
        parent.some(disease => {
          if(disease.children) {
            const lll = this._addToTree(dNode, disease.children)
            const d2: DiseaseNode = new DiseaseNode({...disease, children: lll})
            diseaseMap.set(d2.gardId, d2)
            ret = [...diseaseMap.values()].sort((a,b) => b.childrenCount - a.childrenCount);
          }

        })
      }
      return ret;
    }
    }

_setFragment(origin: string | null, options: {limit?: number, offset?: number}){
  switch(origin) {
    case 'epi-articles': {
      EPIARTICLES.articleOptions.limit = options.limit ? options.limit : 10
      if(options.offset) {
        EPIARTICLES.articleOptions.offset = Number(options.offset);
      }
      break;
    }
    case 'nonepi-articles': {
      NONEPIARTICLES.articleOptions.limit = options.limit ? options.limit : 10;
      if(options.offset) {
        NONEPIARTICLES.articleOptions.offset = Number(options.offset);
      }
      break;
    }
    case 'project': {
      PROJECTVARIABLES.coreProjectsOptions.limit = options.limit ? options.limit : 10;
      if(options.offset) {
        PROJECTVARIABLES.coreProjectsOptions.offset = Number(options.offset);
      }
      break;
    }
    case 'trials': {
      FETCHTRIALSVARIABLES.limit = options.limit ? options.limit : 10;
      if(options.offset) {
        FETCHTRIALSVARIABLES.offset = Number(options.offset);
      }
      break;
    }
  }
}

constructor(
    private readonly actions$: Actions,
    private diseaseService: DiseaseService,
    private store: Store
  ) {}
}
