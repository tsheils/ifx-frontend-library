import { inject, Injectable } from '@angular/core';
import { DocumentNode } from '@apollo/client';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class TrialService {
  private apollo = inject(Apollo);

  fetchTrials(query: DocumentNode, variables: object = {}) {
    return this.apollo
      .use('trials')
      .watchQuery({
        query,
        variables,
      })
      .valueChanges.pipe();
  }
}
