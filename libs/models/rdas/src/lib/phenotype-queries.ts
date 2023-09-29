import { gql } from "apollo-angular";

export const PHENOTYPEFILTERPARAMETERS: {
  skip?: number,
  limit?: number,
  term?: string,
  terms?: string[]
} = {
  skip: 0,
  limit: 200,
  term: '""',
  terms: [],
}

export const PHENOTYPEFILTERS = gql`
query PhenotypeFilters($skip: Int, $limit: Int, $term: String, $terms: [String]) {
  searchFilters:phenotypeSearch(skip: $skip, limit: $limit, term: $term) {
    term
    count
  }
  selectedFilters:phenotypeFilteredCounts(terms: $terms) {
    term
    count
  }
  allFilters:phenotypeCounts(skip: $skip, limit: $limit ,terms: $terms) {
    term
    count
  }
}
`

