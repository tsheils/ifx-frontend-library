/*
import { inject, Injectable } from '@angular/core';
import { DocumentNode, ObservableQuery } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apollo = inject(Apollo);

  fetchProjects(
    query: DocumentNode,
    variables: CoreProjectWhereParams,
  ): Observable<ObservableQuery.Result<unknown>> {
    return this.apollo
      .watchQuery({
        query,
        variables,
      })
      .valueChanges.pipe();
  }
}
*/
