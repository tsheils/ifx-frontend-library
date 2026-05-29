import * as Types from './**/libs/models/rdas-models/src/lib/**/generated-types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const GeneFiltersDocument = gql`
    query GeneFilters($offset: Int, $limit: Int, $sort: [GeneSort!], $allGenesWhere: GeneWhere, $filteredGenesWhere: GeneWhere, $searchedGenesWhere: GeneWhere) {
  allFilters: genes(
    where: $allGenesWhere
    sort: $sort
    limit: $limit
    offset: $offset
  ) {
    term: geneSymbol
    count: countDiseases
  }
  selectedFilters: genes(
    sort: $sort
    where: $filteredGenesWhere
    limit: $limit
    offset: $offset
  ) {
    term: geneSymbol
    count: countDiseases
  }
  searchFilters: genes(
    sort: $sort
    limit: $limit
    where: $searchedGenesWhere
    offset: $offset
  ) {
    term: geneSymbol
    count: countDiseases
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GeneFiltersGQL extends Apollo.Query<GeneFiltersQuery, GeneFiltersQueryVariables> {
    document = GeneFiltersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }