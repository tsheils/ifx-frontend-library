import { Params } from '@angular/router';
import { TypedDocumentNode } from '@apollo/client';
import { gql } from 'apollo-angular';
import {
  ClinicalTrialWhere,
  DiseaseSort,
  DiseaseWhere,
  SortDirection,
} from './generated-types';
import { DiseasesTypeaheadGQL } from './disease-queries.generated';


export const DISEASEQUERY = gql`
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

export const DISEASESTATICFILTERSQUERY = gql`
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

export const DISEASEDYNAMICFILTERSQUERY = gql`
  query DiseaseDynamicFiltersQuery(
    $where: DiseaseWhere
    $clinicalTrialWhere: ClinicalTrialWhere
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
  }

`;

export const DISEASELISTQUERY = gql`
  query DiseaseListQuery(
    $limit: Int
    $offset: Int
    $sort: [DiseaseSort!]
    $diseaseWhere: DiseaseWhere
  ) {
    diseases(
      limit: $limit
      offset: $offset
      sort: $sort
      where: $diseaseWhere
    ) {
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

export const DISEASETYPEAHEAD = gql`
  query DiseasesTypeahead($searchString: String, $limit: Int) {
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

export class PhenotypeParameter {
  some:
    | {
        hpoTerm: {
          in: string[];
        };
      }
    | undefined;
}

export class GeneParameter {
  some:
    | {
        geneSymbol: {
          in: string[];
        };
      }
    | undefined;
}


export class DiseaseQueryFactory {
  query!: TypedDocumentNode<unknown, unknown>;
  params!: {
    limit?: number;
    offset?: number;
    sort?: DiseaseSort[];
    where?: DiseaseWhere;
    clinicalTrialWhere?: ClinicalTrialWhere;
  };

  getQuery(params: Params) {
    this.query = this._buildQuery(params);
    this._buildParams(params);
    return { query: this.query, params: this.params };
  }

  getStaticFilterQuery(params: Params) {
    this.query = DISEASESTATICFILTERSQUERY;
    this._buildParams(params);
    return { query: this.query, params: this.params };
  }

  getDynamicFilterQuery(params: Params) {
    this.query = DISEASEDYNAMICFILTERSQUERY;
    this._buildParams(params);
    return { query: this.query, params: this.params };
  }

  _buildQuery(params: Params) {
    if (params['gardId']) {
      return DISEASEQUERY;
    } else {
      this.params.limit = 10;
      this.params.offset = 0;
      this.params.sort = [{ countArticles: 'DESC' as SortDirection }];
      return DISEASELISTQUERY;
    }
  }

  //todo: should there be text search for q instead of contains? =-- change query
  _buildParams(params: Params) {
    this.params = {}
    Object.entries(params).forEach((key) => {
      switch (key[0]) {
        case 'limit': {
          this.params.limit = params['pageSize']
            ? +(params['pageSize'] as number)
            : 10;
          break;
        }
        case 'offset': {
          this.params.offset = params['pageIndex']
            ? +(
                (params['pageIndex'] - 1) *
                (this.params['limit'] ? +this.params['limit'] : 10)
              )
            : 0;
          break;
        }
        case 'sort': {
          this.params.sort = [
            {
              [params['sort']]: params['direction']
                ? (params['direction'] as SortDirection)
                : ('DESC' as SortDirection),
            },
          ];
          break;
        }
        case 'gardIds': {
          this.params.where = { gardId: { in: params['gardIds'] } };
          break;
        }
        case 'gardId': {
          this.params.where = { gardId: { eq: params['gardId'] } };
          break;
        }
        case 'genes': {
          if (!this.params.where) {
            this.params.where = {};
          }
          this.params.where.hasAssociatedGene = {
            some: { geneSymbol: { in: params['genes'].split('&') } },
          };
          break;
        }
        case 'phenotypes': {
          if (!this.params.where) {
            this.params.where = {};
          }
          this.params.where.hasPhenotype = {
            some: { hpoTerm: { in: params['phenotypes'].split('&') } },
          };
          break;
        }
        case 'q': {
          this.params.where = { gardName: { contains: params['q'] } };
          break;
        }
        case 'phase': {
          if (!this.params.clinicalTrialWhere) {
            this.params.clinicalTrialWhere = {};
          }
          if (params['phase'].length) {
              this.params.clinicalTrialWhere.phase = {
                in: params['phase'],
              };
            }
          break;
        }
        case 'overallStatus': {
          if (!this.params.clinicalTrialWhere) {
            this.params.clinicalTrialWhere = {};
          }
          if (params['overallStatus'].length) {
              this.params.clinicalTrialWhere.overallStatus = {
                in: params['overallStatus'],
              };
          }
          break;
        }
        case 'studyType': {
          if (!this.params.clinicalTrialWhere) {
            this.params.clinicalTrialWhere = {};
          }
          if (params['studyType'].length) {
              this.params.clinicalTrialWhere.studyType = {
                in: params['studyType'],
              };
          }
          break;
        }
      }
    });
  }
}
