import { gql } from 'apollo-angular';
import { Injectable, inject } from '@angular/core';
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
  providedIn: 'root',
})
export class DiseaseQueryGQL extends Apollo.Query<
  DiseaseQueryQuery,
  DiseaseQueryQueryVariables
> {
  document = DiseaseQueryDocument;
  override apollo = inject(Apollo.Apollo);
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
  providedIn: 'root',
})
export class DiseaseStaticFiltersQueryGQL extends Apollo.Query<
  DiseaseStaticFiltersQueryQuery,
  DiseaseStaticFiltersQueryQueryVariables
> {
  document = DiseaseStaticFiltersQueryDocument;
  override apollo = inject(Apollo.Apollo);
}
export const DiseaseDynamicFiltersQueryDocument = gql`
  query DiseaseDynamicFiltersQuery(
    $where: DiseaseWhere
    $clinicalTrialWhere: ClinicalTrialWhere
    $articleWhere: ArticleWhere
  ) {
    trialCountsByStatus(
      where: $where
      clinicalTrialWhere: $clinicalTrialWhere
    ) {
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

    diseaseArticleByYear(where: $where, articleWhere: $articleWhere) {
      count
      term
    }
    diseaseArticleByEpi(where: $where, articleWhere: $articleWhere) {
      count
      term
    }
    diseaseArticleByNHS(where: $where, articleWhere: $articleWhere) {
      count
      term
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DiseaseDynamicFiltersQueryGQL extends Apollo.Query<
  DiseaseDynamicFiltersQueryQuery,
  DiseaseDynamicFiltersQueryQueryVariables
> {
  document = DiseaseDynamicFiltersQueryDocument;
  override apollo = inject(Apollo.Apollo);
}
export const DiseaseListQueryDocument = gql`
  query DiseaseListQuery(
    $limit: Int
    $offset: Int
    $sort: [DiseaseSort!]
    $where: DiseaseWhere
  ) {
    diseases(limit: $limit, offset: $offset, sort: $sort, where: $where) {
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
    total: diseasesConnection(where: $where) {
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
  override apollo = inject(Apollo.Apollo);
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
  providedIn: 'root',
})
export class DiseasesTypeaheadGQL extends Apollo.Query<
  DiseasesQuery,
  DiseasesQueryVariables
> {
  document = DiseasesDocument;
  override apollo = inject(Apollo.Apollo);
}

export const AllDiseasesFilterCountDocument = gql`
  query FieldCounts {
    fieldCounts(limit: 1) {
      fieldCounts {
        allArticlesByYear {
          count
          term
        }
        allEpiArticlesByYear {
          count
          term
        }
        allNHSArticlesByYear {
          term
          count
        }
        allProjectsByYear {
          count
          term
        }
        allTrialsByPhase {
          count
          term
        }
        allTrialsByStatus {
          count
          term
        }
        allTrialsByType {
          count
          term
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AllDiseasesFieldCountsGQL extends Apollo.Query<
  DiseasesQuery,
  DiseasesQueryVariables
> {
  document = AllDiseasesFilterCountDocument;
  override apollo = inject(Apollo.Apollo);
}
