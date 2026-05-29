/*
import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { map, Observable} from "rxjs";
import {ObservableQuery} from "@apollo/client";
import { ClinicalTrialQueryGQL, ClinicalTrialQueryQuery } from 'rdas-models';
@Injectable({
  providedIn: 'root',
})
export class TrialService {
  private postsQuery = inject(ClinicalTrialQueryGQL);
  private apollo = inject(Apollo);

/!*
  fetchClinicalTrials(
    query: DocumentNode,
    variables: unknown,
  ): Observable<ClinicalTrialQueryQuery> {
    return this.postsQuery.watch().valueChanges.pipe();
  }
*!/

/!*
    this.apollo
      .watchQuery({
        query,
        variables,
      })
      .valueChanges.pipe();
  }*!/
}
*/
