import { Injectable } from '@angular/core';
import { DocumentNode } from "@apollo/client";
import {Apollo} from "apollo-angular";

@Injectable({
  providedIn: 'root'
})
export class DiseaseService {

  constructor(
    private apollo: Apollo
  ) { }

  fetchDiseases(query: DocumentNode, variables: object = {}) {
    return this.apollo.use('diseases').watchQuery({
        query,
        variables
      }
    ).valueChanges.pipe()
  }

  fetchArticles(query: DocumentNode, variables: object = {}) {
    return this.apollo.use('articles').watchQuery({
        query,
        variables
      }
    ).valueChanges.pipe()
  }


  fetchTrials(query: DocumentNode, variables: object = {}) {
    return this.apollo.use('trials').watchQuery({
        query,
        variables
      }
    ).valueChanges.pipe()
  }

  fetchProjects(query: DocumentNode, variables: object = {}) {
    return this.apollo.use('projects').watchQuery({
        query,
        variables
      }
    ).valueChanges.pipe()
  }

  /*manualQuery(query: string, variables: object = {}, database: string) {
    return this.apollo.use(database).watchQuery({
        query,
        variables
      }
    ).valueChanges.pipe()
  }*/
}
