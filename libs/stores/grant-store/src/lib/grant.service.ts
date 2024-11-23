import { Injectable } from '@angular/core';
import { DocumentNode } from '@apollo/client';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class GrantService {
  constructor(private apollo: Apollo) {}

  fetchProjects(query: DocumentNode, variables: object = {}) {
    return this.apollo
      .use('projects')
      .watchQuery({
        query,
        variables,
      })
      .valueChanges.pipe();
  }
}
