import { Injectable } from '@angular/core';
import {
  Article,
  ARTICLEVARIABLES, ClinicalTrial, CoreProject, Disease, DISEASEQUERYPARAMETERS, DISEASETYPEAHEAD, FETCHARTICLESQUERY,
  FETCHDISEASEQUERY, FETCHDISEASESLISTQUERY, FETCHPROJECTSQUERY,
  FETCHTRIALSQUERY,
  FETCHTRIALSVARIABLES,
  LISTQUERYPARAMETERS, Project, PROJECTVARIABLES
} from "@ncats-frontend-library/models/rdas";
import { Page } from "@ncats-frontend-library/models/utils";
import { DiseaseService } from "../disease.service";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {ROUTER_NAVIGATION, RouterNavigationAction} from "@ngrx/router-store";
import { combineLatest, exhaustMap, filter, forkJoin, map, mergeMap, of, switchMap, take, tap } from "rxjs";
import * as DiseasesActions from './diseases.actions';

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
                const diseaseArr = res.data.diseaseSearch.map((obj: { [key: string]: string }) => new Disease(obj))
                const ids = diseaseArr.map((d: Disease) => d.gardId);
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
      filter((r: RouterNavigationAction) => r.payload.routerState.url.startsWith('/diseases')),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      switchMap((params: { pageSize?: number, pageIndex?: number}) => {
        const pageSize: number = params.pageSize ? params.pageSize as number: 10;
        const pageIndex: number = params.pageIndex ? params.pageIndex as number : 0;
        LISTQUERYPARAMETERS.options.limit =  +pageSize;
        LISTQUERYPARAMETERS.options.offset = +pageSize * (+pageIndex +1);
        return this.diseaseService.fetchDiseases(FETCHDISEASESLISTQUERY, LISTQUERYPARAMETERS)
          .pipe(
            map((res: any) => {
              if(res && res.data) {
                const page: Page = { pageSize: pageSize, pageIndex: pageIndex, total: res.data.total.count}
                const diseaseArr = res.data.diseases.map((obj: { [key: string]: string }) => new Disease(obj))
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
        console.log(action)
        switch(action.source) {
          case 'article': {
            Object.keys(action.options).forEach((key: string) => {
              console.log(key);
              console.log(ARTICLEVARIABLES)
              ARTICLEVARIABLES[key as keyof typeof ARTICLEVARIABLES] =
                Object.assign(ARTICLEVARIABLES[key as keyof typeof ARTICLEVARIABLES] as typeof ARTICLEVARIABLES, action.options[key])
            })
            break;
          }
          case 'project': {
            Object.keys(action.options).forEach((key: string) => {
              console.log(action.options)
              console.log(PROJECTVARIABLES)
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
          //  map(([diseaseData, trialsData]: [any, any]) => {
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
      filter((r: RouterNavigationAction) => r.payload.routerState.url != '/diseases' && r.payload.routerState.url.startsWith('/disease')),
      map((r: RouterNavigationAction) => r.payload.routerState.root.queryParams),
      switchMap((params: {id?: string}) => {
        DISEASEQUERYPARAMETERS.where = {GardId: params.id};
        ARTICLEVARIABLES.gardWhere.gard_id =  params.id;
        PROJECTVARIABLES.coreProjectsWhere = {projectsUnderCoreConnection_ALL: {node: {diseasesResearchedBy_SINGLE: {gard_id: params.id}}}};
        FETCHTRIALSVARIABLES.ctwhere = {GARDId: params.id};
        return forkJoin(
          this.diseaseService.fetchDiseases(FETCHDISEASEQUERY, DISEASEQUERYPARAMETERS).pipe(take(1)),
          this.diseaseService.fetchArticles(FETCHARTICLESQUERY, ARTICLEVARIABLES).pipe(take(1)),
          this.diseaseService.fetchProjects(FETCHPROJECTSQUERY, PROJECTVARIABLES).pipe(take(1)),
          this.diseaseService.fetchTrials(FETCHTRIALSQUERY, FETCHTRIALSVARIABLES).pipe(take(1))
        )
          .pipe(
            map(([diseaseData, articleData, projectsData, trialsData]: [any, any, any, any]) => {
      //      map(([diseaseData, trialsData]: [any, any]) => {
              console.log(diseaseData)
              console.log(articleData)
              console.log(projectsData)
              console.log(trialsData)
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


    isLoading$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(DiseasesActions.fetchDisease),
        mergeMap(() => {
          return of(DiseasesActions.loading());
        })
      )
    });


  _makeDiseaseObj(diseaseData:{data:{disease:[Partial<Disease>]}}, articleData: any, projectsData :any, trialsData: any): Disease {
    if (diseaseData && diseaseData.data) {
      console.log(articleData);
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
      if (trialsData.data && trialsData.data.disease.length) {
        diseaseObj.clinicalTrials = trialsData.data.disease[0].gardInClinicalTrials.map((trial: { [key: string]: unknown }) => new ClinicalTrial(trial))
        diseaseObj.clinicalTrialsCount = trialsData.data.disease[0].ctcount.count;
      }
      return diseaseObj;
    } else return new Disease({});
  }


  constructor(
    private readonly actions$: Actions,
    private diseaseService: DiseaseService
  ) {}
}
