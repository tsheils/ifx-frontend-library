import { Injectable } from '@angular/core';
import { Disease } from "@ncats-frontend-library/models/rdas";
import {Apollo, gql} from "apollo-angular";
import {DiseasesFacade} from "./state/diseases.facade";
import * as DiseaseActions from "./state/diseases.actions";

import {mergeMap, of} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class DiseaseService {
  data: any = {};

  socket!: WebSocketSubject<any>;

  constructor(
    private apollo: Apollo,
    private diseaseFacade: DiseasesFacade
  ) { }

  fetchArticles(query: any, variables: object = {}) {
    console.log("fetch articles");
    return this.apollo.use('articles').watchQuery({
        query,
        variables
      }
    ).valueChanges.pipe()
  }


  fetchTrials(query: any, variables: object = {}) {
    console.log("fetch trials");
    return this.apollo.use('trials').watchQuery({
        query,
        variables
      }
    ).valueChanges.pipe()
  }

  fetchProjects(query: any, variables: object = {}) {
    console.log("fetch projects");
    return this.apollo.use('projects').watchQuery({
        query,
        variables
      }
    ).valueChanges.pipe()
  }

  createDriver( url: string): void {
    this.socket = webSocket({url: url});
    this.socket.pipe(
      mergeMap(response => {
        console.log("websocket driver?");
        switch (response.origin) {
          case "search": {
            this.diseaseFacade.dispatch(DiseaseActions.searchDiseasesSuccess({typeahead: response.data.typeahead}));
            break;
          }
          case "fetch" :{
            const diseaseObj: Disease = new Disease(response.data.disease);
            /*    if(response.data.mentionedInArticles) {
                  diseaseObj.mentionedInArticles = response.data.mentionedInArticles.map((art: any) =>new Article(art))
                }*/
            this.diseaseFacade.dispatch(DiseaseActions.fetchDiseaseSuccess({disease: diseaseObj}));
            break;
          }
        }
        return of(response);
      })).subscribe()
  }

  read(instance: string, origin: string, call: string, params?: any): void {
    console.log("read websocket");
    this.socket.next({txcType: 'read', origin: origin, call: call, params: params ? params : null});

  }

  write(instance: string, origin: string, call: string, params?: any): void {
    //  const socket: WebSocketSubject<any> = this.getInstance(instance);
    this.socket.next({txcType: 'write', origin: origin, call: call, params: params ? params : null});
    //  return socket;
  }

  destroy() {
    this.socket.complete();
  }

}
