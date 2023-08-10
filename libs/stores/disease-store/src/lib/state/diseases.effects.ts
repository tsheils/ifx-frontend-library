import { Injectable } from '@angular/core';
import {
  Article,
  ARTICLEVARIABLES, CATEGORYTREE,
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
  FETCHDISEASESLISTQUERY, FETCHPATH, FETCHPATHDISEASES,
  FETCHPROJECTSQUERY,
  LISTQUERYPARAMETERS,
  PROJECTVARIABLES, TREEROOTPARAMETERS, FETCHROOT, FETCHARTICLECOUNTS, FETCHTRIALSVARIABLES, FETCHTRIALSQUERY
} from "@ncats-frontend-library/models/rdas";
import { Page } from "@ncats-frontend-library/models/utils";
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
import * as fromDiseases from './diseases.reducer';
import * as fromDiseasesSelectors from './diseases.selectors';
import * as diseaseFacade from './diseases.facade';


@Injectable()
export class DiseasesEffects {

  searchDiseases = createEffect(() =>
    this.actions$.pipe(
      ofType(DiseasesActions.searchDiseases),
      mergeMap((action) => {
        return this.diseaseService.fetchDiseases(DISEASETYPEAHEAD, { searchString: action.term + '~' })
          .pipe(
            map((res: any) => {
              if (res && res.data) {
                const diseaseArr = res.data.diseaseSearch.map((obj: Partial<Disease>) => new Disease(obj))
                return DiseasesActions.searchDiseasesSuccess({ typeahead: diseaseArr })
              } else return DiseasesActions.searchDiseasesFailure({ error: "No Diseases found" })
            })
          )
      })
    )
  )

  loadDiseases$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) =>  r.payload.routerState.url.startsWith('/diseases')),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      switchMap((params: { pageSize?: number, pageIndex?: number, parentId?: string}) => {
        let query;
        let queryParams;
        const pageSize: number = params.pageSize ? params.pageSize as number: 10;
        const pageIndex: number = params.pageIndex ? params.pageIndex as number : 0;
        if(params.parentId) {
          DISEASEBRANCHPARAMETERS.searchString = params["parentId"];
            DISEASEBRANCHPARAMETERS.limit = +pageSize;
            DISEASEBRANCHPARAMETERS.skip = +pageSize * (+pageIndex);
          query = FETCHPATHDISEASES
          queryParams = DISEASEBRANCHPARAMETERS
        } else {
          LISTQUERYPARAMETERS.options.limit =  +pageSize;
          LISTQUERYPARAMETERS.options.offset = +pageSize * (+pageIndex +1);
          queryParams = LISTQUERYPARAMETERS
          query = FETCHDISEASESLISTQUERY
        }
        return this.diseaseService.fetchDiseases(query, queryParams)
          .pipe(
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
  fetchDisease = createEffect(() =>
    this.actions$.pipe(
      ofType(DiseasesActions.fetchDisease),
      mergeMap((action: any) => {
        switch(action.source) {
          case 'article': {
            Object.keys(action.options).forEach((key: string) => {
              ARTICLEVARIABLES[key as keyof typeof ARTICLEVARIABLES] =
                Object.assign(ARTICLEVARIABLES[key as keyof typeof ARTICLEVARIABLES] as typeof ARTICLEVARIABLES, action.options[key])
            })
            break;
          }
          case 'project': {
            Object.keys(action.options).forEach((key: string) => {
              PROJECTVARIABLES[key as keyof typeof PROJECTVARIABLES] =
                Object.assign(PROJECTVARIABLES[key as keyof typeof PROJECTVARIABLES] as typeof PROJECTVARIABLES, action.options[key])
            })
            break;
          }
          case 'trials': {
            Object.keys(action.options).forEach(key => {
              FETCHTRIALSVARIABLES[key as keyof typeof FETCHTRIALSVARIABLES] =
                Object.assign(FETCHTRIALSVARIABLES[key as keyof typeof FETCHTRIALSVARIABLES] as typeof FETCHTRIALSVARIABLES, action.options[key])
            })
            break;
          }
        }
        return combineLatest(
          this.diseaseService.fetchDiseases(FETCHDISEASEQUERY, DISEASEQUERYPARAMETERS).pipe(take(1)),
          this.diseaseService.fetchArticles(FETCHARTICLESQUERY, ARTICLEVARIABLES).pipe(take(1)),
          this.diseaseService.fetchProjects(FETCHPROJECTSQUERY, PROJECTVARIABLES).pipe(take(1)),
          this.diseaseService.fetchTrials(FETCHTRIALSQUERY, FETCHTRIALSVARIABLES).pipe(take(1))
        )
          .pipe(
            map(([diseaseData, articleData, projectsData, trialsData]: [any, any, any, any]) => {
              if(diseaseData && diseaseData.data) {
                const diseaseObj: Disease = this._makeDiseaseObj(diseaseData, articleData, projectsData, trialsData);
                return DiseasesActions.fetchDiseaseSuccess({disease: diseaseObj})
              }
              else return DiseasesActions.fetchDiseaseFailure({error: "No Disease found"})
            })
          )
      })
    )
  );

  loadDisease$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r: RouterNavigationAction) => !r.payload.routerState.url.includes('/diseases') && r.payload.routerState.url.startsWith('/disease')),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      switchMap((params: {id?: string}) => {
        DISEASEQUERYPARAMETERS.where = {GardId: params.id};
        ARTICLEVARIABLES.gardWhere.GardId =  params.id;
        PROJECTVARIABLES.coreProjectsWhere = {projectsUnderCoreConnection_ALL: {node: {gardsresearchedBy_SINGLE: {GardId: params.id}}}};
        FETCHTRIALSVARIABLES.ctwhere = {investigatesConditionConditions_SINGLE: { mappedToGardGards_SINGLE: {GardId: params.id}}};
        return forkJoin(
          this.diseaseService.fetchDiseases(FETCHDISEASEQUERY, DISEASEQUERYPARAMETERS).pipe(take(1)),
          this.diseaseService.fetchArticles(FETCHARTICLESQUERY, ARTICLEVARIABLES).pipe(take(1)),
          this.diseaseService.fetchProjects(FETCHPROJECTSQUERY, PROJECTVARIABLES).pipe(take(1)),
          this.diseaseService.fetchTrials(FETCHTRIALSQUERY, FETCHTRIALSVARIABLES).pipe(take(1))
        )
          .pipe(
            map(([diseaseData, articleData, projectsData, trialsData]: [any, any, any, any]) => {
              if(diseaseData && diseaseData.data) {
                const diseaseObj: Disease = this._makeDiseaseObj(diseaseData, articleData, projectsData, trialsData); //new Disease(diseaseData.data.disease[0]);
                return DiseasesActions.fetchDiseaseSuccess({disease: diseaseObj})
              }
              else return DiseasesActions.fetchDiseaseFailure({error: "No Disease found"})
            })
          )
      })
    )}
  );

/*
  loadTree$ = createEffect(() => {
    return this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
     filter((r: RouterNavigationAction) => r.payload.routerState.url.startsWith('/diseases') && !r.payload.routerState.root.queryParams['parentId']),
      switchMap(() => {
        return this.diseaseService.fetchDiseases(CATEGORYTREE, TREEROOTPARAMETERS)
          .pipe(
            map((res: any) => {
              if(res && res.data) {
                console.log(res);
                const diseaseArr = res.data.diseases
                  .map((obj: Partial<DiseaseNode>) => new DiseaseNode(obj))
                  .sort((a: DiseaseNode, b: DiseaseNode) => b.childrenCount - a.childrenCount)
                return DiseasesActions.loadDiseaseTreeSuccess({diseases: diseaseArr})
              }
              else return DiseasesActions.loadDiseaseTreeFailure({error: "No Disease found"})
            })
          )
      })
    )}
  );
*/

/*
  fetchPath$ = createEffect(() => {
    return this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
     filter((r: RouterNavigationAction) => r.payload.routerState.url.startsWith('/diseases') && r.payload.routerState.root.queryParams['parentId']),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      switchMap((params) => {
        return this.diseaseService.fetchDiseases(FETCHPATH, { searchString: params["parentId"]})
          .pipe(
            map((res: any) => {
              console.log(res);
              if(res && res.data) {
                const diseaseArr = res.data.treeBranch[0].nodes
                  .map((obj: Partial<DiseaseNode>) => new DiseaseNode(obj))
                  .sort((a: DiseaseNode, b: DiseaseNode) => b.childrenCount - a.childrenCount)
                console.log(diseaseArr);
                return DiseasesActions.loadDiseaseTreeSuccess({diseases: diseaseArr})
              }
              else return DiseasesActions.loadDiseaseTreeFailure({error: "No Disease found"})
            })
          )
      })
    )}
  );
*/


  fetchTreeBranch$ = createEffect(() => {
    return this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
     filter((r: RouterNavigationAction) => r.payload.routerState.url.startsWith('/diseases')),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      concatLatestFrom(() => this.store.select(fromDiseasesSelectors.getDiseaseTree)),
      switchMap(([params, tree]) => {
        let query;
        let qParams;
        if(!tree) {
          if(params["parentId"]) {
         //   console.log("no tree, maybe page, parent id")
            query = FETCHPATH;
            qParams = { searchString: params["parentId"] };
          } else {
         //   console.log("no tree, maybe page, no parent id")
            query = FETCHROOT;
            qParams = undefined;
          }
        } else {
          if(params["pageIndex"]) {
          //  console.log("tree, page, no parent id")
            query = FETCHROOT;
            qParams = undefined;
          } else {
            if(params["parentId"]) {
           //   console.log("tree, no page, parent id")
              DISEASEQUERYPARAMETERS.where = { GardId: params["parentId"] };
              query = CATEGORYTREEBRANCH;
              qParams = DISEASEQUERYPARAMETERS;
            } else {
           //   console.log("tree, no page, no parent id")
              query = FETCHROOT;
              qParams = undefined;
            }
          }
        }
        return this.diseaseService.fetchDiseases(query, qParams )
          .pipe(
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
    )}
  );


  isLoadingDisease$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(DiseasesActions.fetchDisease),
        mergeMap(() => {
          return of(DiseasesActions.loading());
        })
      )
    });

  isLoadingDiseaseList$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(ROUTER_NAVIGATION),
        mergeMap(() => {
          return of(DiseasesActions.loading());
        })
      )
    });

  _makeDiseaseObj(diseaseData:{data:{disease:[Partial<DiseaseNode>]}}, articleData?: any, projectsData? :any, trialsData?: any): Disease {
    console.log(articleData)
    console.log(trialsData)
    if (diseaseData && diseaseData.data) {
      const diseaseObj: Disease = new Disease(diseaseData.data.disease[0]);
      if (articleData.data && articleData.data.articles.length) {
        if (articleData.data.articles[0] && articleData.data.articles[0].epiArticles.length) {
          diseaseObj.epiArticles = articleData.data.articles[0].epiArticles.map((art: { [key: string]: unknown }) => new Article(art))
          diseaseObj.epiCount = articleData.data.articles[0]._epiCount.count;
        }
        if (articleData.data.articles[0] && articleData.data.articles[0].nonEpiArticles.length) {
          diseaseObj.nonEpiArticles = articleData.data.articles[0].nonEpiArticles.map((art: { [key: string]: unknown }) => new Article(art))
          diseaseObj.nonEpiCount = articleData.data.articles[0]._nonEpiCount.count;
        }
      }
      if (projectsData.data && projectsData.data.coreProjects.length) {
        diseaseObj.projects = projectsData.data.coreProjects.map((proj: { [key: string]: unknown }) => new CoreProject(proj))
        diseaseObj.projectCount = projectsData.data.count.count;
      }
      if (trialsData.data && trialsData.data.clinicalTrials.length) {
        diseaseObj.clinicalTrials = trialsData.data.clinicalTrials.map((trial: { [key: string]: unknown }) => new ClinicalTrial(trial))
        diseaseObj.clinicalTrialsCount = trialsData.data.clinicalTrialsAggregate.count;
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



constructor(
    private readonly actions$: Actions,
    private diseaseService: DiseaseService,
    private store: Store
  ) {}
}
