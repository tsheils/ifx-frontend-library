import { inject, Injectable } from '@angular/core';
import { ApolloQueryResult, DocumentNode } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private apollo = inject(Apollo);

  fetchDiseases(
    query: DocumentNode,
    variables: object = {}
  ): Observable<ApolloQueryResult<unknown>> {
    return this.apollo
      .use('diseases')
      .watchQuery({
        query,
        variables,
      })
      .valueChanges.pipe();
  }

  fetchArticles(query: DocumentNode, variables: object = {}) {
    return this.apollo
      .use('articles')
      .watchQuery({
        query,
        variables,
      })
      .valueChanges.pipe();
  }

  fetchTrials(query: DocumentNode, variables: object = {}) {
    return this.apollo
      .use('trials')
      .watchQuery({
        query,
        variables,
      })
      .valueChanges.pipe();
  }

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
