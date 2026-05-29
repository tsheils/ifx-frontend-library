import * as Types from './**/libs/models/rdas-models/src/lib/**/generated-types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const PhenotypeFiltersDocument = gql`
    query PhenotypeFilters($offset: Int, $limit: Int, $sort: [PhenotypeSort!], $where: PhenotypeWhere) {
  phenotypes(limit: $limit, offset: $offset, sort: $sort, where: $where) {
    hpoId
    term: hpoTerm
    count: countDiseases
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PhenotypeFiltersGQL extends Apollo.Query<PhenotypeFiltersQuery, PhenotypeFiltersQueryVariables> {
    document = PhenotypeFiltersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }