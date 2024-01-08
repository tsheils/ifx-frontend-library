import { gql } from 'apollo-angular';

export const GENEFILTERPARAMETERS: {
  skip?: number;
  limit?: number;
  term?: string;
  terms?: string[];
} = {
  skip: 0,
  limit: 200,
  term: '""',
  terms: [],
};

export const GENEFILTERS = gql`
  query GeneFilters($skip: Int, $limit: Int, $term: String, $terms: [String]) {
    searchFilters: geneSearch(skip: $skip, limit: $limit, term: $term) {
      term
      count
    }
    selectedFilters: geneFilteredCounts(terms: $terms) {
      term
      count
    }
    allFilters: geneCounts(skip: $skip, limit: $limit, terms: $terms) {
      term
      count
    }
  }
`;
