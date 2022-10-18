import { Injectable } from '@angular/core';
import {
  ARTICLEVARIABLES, ClinicalTrial, Disease,
  FETCHDISEASEQUERY, FETCHDISEASESLISTQUERY,
  //FETCHPROJECTSQUERY,
  FETCHTRIALSQUERY,
  FETCHTRIALSVARIABLES,
  LISTQUERYPARAMETERS, PROJECTVARIABLES
} from "@ncats-frontend-library/models/rdas";
import { Page } from "@ncats-frontend-library/models/utils";
import { DiseaseService } from "../disease.service";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {ROUTER_NAVIGATION, RouterNavigationAction} from "@ngrx/router-store";
import {combineLatest, filter, forkJoin, map, mergeMap, switchMap, take} from "rxjs";
import * as DiseasesActions from './diseases.actions';

/*const typeaheadQuery = gql`
  query Query($name: String!) {
    queryTypes {
      TypeaheadQuery(name: $name) {
        name
        gard_id
      }
    }
  }
`*/

@Injectable()
export class DiseasesEffects {
  searchDiseases = createEffect(() =>
    this.actions$.pipe(
      ofType(DiseasesActions.searchDiseases),
    /*  tap((action) => {
        const call = `
         Match (n:Disease)
            WHERE n.name =~ '(?i)' + $term + '.*'
            WITH {name: n.name, gard_id: n.gard_id} as node
            WITH COLLECT(node) AS arr
            WITH arr[0..10] AS typeahead
            RETURN typeahead
        `;
        this.diseaseService.read(
          'epi',
          'search',
          call,
          {term: action.term}
        )
      })*/
    ),{ dispatch: false }
  );

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
        return this.diseaseService.fetchArticles(FETCHDISEASESLISTQUERY, LISTQUERYPARAMETERS)
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

  /*
  diseaseTypeahead = createEffect(() =>
      this.actions$.pipe(
        ofType(DiseasesActions.searchDiseases),
        exhaustMap((action: any) => {
          const variables = {
            "name": action.term.toLocaleLowerCase(),
            "options": {
              "limit": 10
            }
          };
          console.log(variables);
          return this.diseaseService.fetchApollo(typeaheadQuery, variables)
            .pipe(
              map((res: any) => {
          if(res && res.data) {
            console.log(res);
            const disease: Disease = new Disease(res.data.diseases[0]);
            return DiseaseActions.searchDiseasesSuccess({typeahead: res.data.typeahead})
          }
          else return DiseasesActions.searchDiseasesFailure({error: "No Diseases found"})
        })
              )
        })
      )
    );
  */



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
          this.diseaseService.fetchArticles(FETCHDISEASEQUERY, ARTICLEVARIABLES).pipe(take(1)),
       //   this.diseaseService.fetchProjects(FETCHPROJECTSQUERY, PROJECTVARIABLES).pipe(take(1)),
          this.diseaseService.fetchTrials(FETCHTRIALSQUERY, FETCHTRIALSVARIABLES).pipe(take(1))
        )
          .pipe(
            map(([diseaseData, trialsData]: [any, any]) => {
            //map(([diseaseData, projectsData, trialsData]: [any, any, any]) => {
              if(diseaseData && diseaseData.data) {
                const diseaseObj: Disease = new Disease(diseaseData.data.diseases[0]);
             //   diseaseObj.projects = projectsData.data.projects.map((proj: { [key: string]: unknown }) => new Project(proj))
             //   diseaseObj.projectCount = projectsData.data.projectsAggregate.count;
                diseaseObj.clinicalTrials =
                  trialsData.data.disease[0].clinicalTrialClinicalTrials.map((trial:{ [key: string]: unknown  }) => new ClinicalTrial(trial))
            //    diseaseObj.projectCount = projectsData.data.projectsAggregate.count;
                diseaseObj.clinicalTrialsCount = trialsData.data.disease[0].ctcount.count;
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
        ARTICLEVARIABLES.diseasesWhere = {gard_id: params.id};
        PROJECTVARIABLES.projectsWhere = {diseasesisInvestigatedBy_SOME: {gard_id: params.id}};
        FETCHTRIALSVARIABLES.ctwhere = {GARDId: params.id};
        return forkJoin(
          this.diseaseService.fetchArticles(FETCHDISEASEQUERY, ARTICLEVARIABLES).pipe(take(1)),
        //  this.diseaseService.fetchProjects(FETCHPROJECTSQUERY, PROJECTVARIABLES).pipe(take(1)),
          this.diseaseService.fetchTrials(FETCHTRIALSQUERY, FETCHTRIALSVARIABLES).pipe(take(1))
        )
          .pipe(
         //   map(([diseaseData, projectsData, trialsData]: [any, any, any]) => {
            map(([diseaseData, trialsData]: [any, any]) => {
              if(diseaseData && diseaseData.data) {
                const diseaseObj: Disease = new Disease(diseaseData.data.diseases[0]);
  /*              if(projectsData.data && projectsData.data.projects.length) {
                  diseaseObj.projects = projectsData.data.projects.map((proj: any) => new Project(proj))
                  diseaseObj.projectCount = projectsData.data.projectsAggregate.count;
                }*/
                if(trialsData.data && trialsData.data.disease.length) {
                  diseaseObj.clinicalTrials = trialsData.data.disease[0].clinicalTrialClinicalTrials.map((trial:{ [key: string]: unknown  }) => new ClinicalTrial(trial))
                  diseaseObj.clinicalTrialsCount = trialsData.data.disease[0].ctcount.count;
                }
                return DiseasesActions.fetchDiseaseSuccess({disease: diseaseObj})
              }
              else return DiseasesActions.fetchDiseaseFailure({error: "No Disease found"})
            })
          )
      })
    )}
  );



  /*  isLoading$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(DiseasesActions.fetchDisease),
        filter((r: RouterNavigationAction) => {
          return r.payload.routerState.url.startsWith('/disease')
        }),
        mergeMap(() => {
          return of(true)
   //       return of(DiseasesActions.loadDiseases());
        })
      )
    }, {dispatch: false});*/



  constructor(
    private readonly actions$: Actions,
    private diseaseService: DiseaseService
  ) {}
}
