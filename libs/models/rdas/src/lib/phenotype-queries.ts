import { gql } from "apollo-angular";

export const PHENOTYPEPARAMETERS: {
  skip?: number,
  limit?: number,
  term?: string
} = {
  skip: 0,
  limit: 100
}

export const FETCHPHENOTYPES = gql`
  query PhenotypeCounts($skip: Int, $limit: Int, $term: String) {
    phenotypeCounts(skip: $skip, limit: $limit, term: $term) {
      term
      count
    }
  }
`

export const SEARCHPHENOTYPES = gql`
  query PhenotypeSearchCounts($skip: Int, $limit: Int, $term: String) {
    phenotypeCounts: phenotypeSearch(skip: $skip, limit: $limit, term: $term) {
      term
      count
    }
  }
`



