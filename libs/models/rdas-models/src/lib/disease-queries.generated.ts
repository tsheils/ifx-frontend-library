import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
import {
  DiseaseDynamicFiltersQueryQuery,
  DiseaseDynamicFiltersQueryQueryVariables,
  DiseaseListQueryQuery,
  DiseaseListQueryQueryVariables,
  DiseaseQueryQuery,
  DiseaseQueryQueryVariables,
  DiseasesQuery,
  DiseasesQueryVariables,
  DiseaseStaticFiltersQueryQuery,
  DiseaseStaticFiltersQueryQueryVariables,
} from './generated-types';
export const DiseaseQueryDocument = gql`
    query DiseaseQuery($where: DiseaseWhere) {
  diseases(where: $where) {
    classificationLevel
    countArticles
    countGenes
    countPhenotypes
    countProjects
    countTrials
    disorderType
    gardId
    gardName
    icd10cm
    mesh
    omim
    orphanet
    synonyms
    umls
    doid
    ncit
    sctid
    mondo
    medGen
    omimps
    diseaseType
    _geneAssociations: hasAssociatedGeneConnection {
      edges {
        gene: node {
          geneIdentifier
          geneSymbol
          geneSynonyms
          geneUrl
          omim
          reference
        }
        properties {
          associationStatus
          associationType
          reference
        }
      }
    }
    _phenotypeAssociations: hasPhenotypeConnection {
      edges {
        phenotype: node {
          hpoId
          hpoTerm
        }
        properties {
          _evidence: evidence
          hpoTermFrequency
          reference
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DiseaseQueryGQL extends Apollo.Query<DiseaseQueryQuery, DiseaseQueryQueryVariables> {
    document = DiseaseQueryDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DiseaseStaticFiltersQueryDocument = gql`
    query DiseaseStaticFiltersQuery($where: DiseaseWhere) {
  diseases(where: $where) {
    filterCounts {
      diseaseArticleByEpi {
        count
        term
      }
      diseaseArticleByNHS {
        count
        term
      }
      diseaseArticleByYear {
        count
        term
      }
      diseaseProjectsByYear {
        count
        term
      }
      diseaseTrialsByPhase {
        count
        term
      }
      diseaseTrialsByStatus {
        count
        term
      }
      diseaseTrialsByType {
        count
        term
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DiseaseStaticFiltersQueryGQL extends Apollo.Query<DiseaseStaticFiltersQueryQuery, DiseaseStaticFiltersQueryQueryVariables> {
    document = DiseaseStaticFiltersQueryDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DiseaseDynamicFiltersQueryDocument = gql`
    query DiseaseDynamicFiltersQuery($where: DiseaseWhere, $clinicalTrialWhere: ClinicalTrialWhere) {
  trialCountsByStatus(where: $where, clinicalTrialWhere: $clinicalTrialWhere) {
    count
    term
  }
  trialCountsByPhase(where: $where, clinicalTrialWhere: $clinicalTrialWhere) {
    count
    term
  }
  trialCountsByType(where: $where, clinicalTrialWhere: $clinicalTrialWhere) {
    count
    term
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DiseaseDynamicFiltersQueryGQL extends Apollo.Query<DiseaseDynamicFiltersQueryQuery, DiseaseDynamicFiltersQueryQueryVariables> {
    document = DiseaseDynamicFiltersQueryDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DiseaseListQueryDocument = gql`
    query DiseaseListQuery($limit: Int, $offset: Int, $sort: [DiseaseSort!], $diseaseWhere: DiseaseWhere) {
  diseases(limit: $limit, offset: $offset, sort: $sort, where: $diseaseWhere) {
    gardName
    gardId
    classificationLevel
    disorderType
    synonyms
    countArticles
    countTrials
    countProjects
    countCoreProjects
    countGenes
    countPhenotypes
  }
  total: diseasesConnection(where: $diseaseWhere) {
    count: totalCount
  }
}
    `;

  @Injectable({
    providedIn: 'root',
  })
  export class DiseaseListQueryGQL extends Apollo.Query<
    DiseaseListQueryQuery,
    DiseaseListQueryQueryVariables
  > {
    document = DiseaseListQueryDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DiseasesDocument = gql`
    query Diseases($searchString: String, $limit: Int) {
  diseaseSearch(searchString: $searchString, limit: $limit) {
    gardName
    gardId
    classificationLevel
    disorderType
    synonyms
    countArticles
    countTrials
    countProjects
    countCoreProjects
    countGenes
    countPhenotypes
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DiseasesTypeaheadGQL extends Apollo.Query<DiseasesQuery, DiseasesQueryVariables> {
    document = DiseasesDocument;

    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
