/*
import { inject, Injectable } from '@angular/core';
import { ObservableQuery, DocumentNode } from '@apollo/client';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiseaseService {
  private apollo = inject(Apollo);

  fetchDiseases(
    query: DocumentNode,
    variables: DiseaseWhereParams,
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
