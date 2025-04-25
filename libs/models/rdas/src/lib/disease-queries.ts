import { Params } from '@angular/router';
import { TypedDocumentNode } from '@apollo/client';
import { gql } from 'apollo-angular';

//todo see if i can keep using router params obj
export class QueryParameters {
    pageSize?: number;
    pageIndex?: number;
    parentId?: string; //hierarchy tree
    sort?: string;
    direction?: string;
    phenotypes?: string;
    genes?: string;
    q?: string;
}

export enum DIRECTION {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class PhenotypeParameter {
  HPOTerm_IN!: string[]
}

export class GeneParameter {
  GeneSymbol_IN!: string[]
}

export class DiseaseQueryFactory {
  query!: TypedDocumentNode<unknown, unknown>;
  params: {
    limit?: number,
    offset?: number,
    sort?: [{ [key: string]: DIRECTION }],
    where?: {
      GardName_CONTAINS? : string,
      hasPhenotypePhenotypes_SOME?: PhenotypeParameter,
      associatedWithGeneGenes_SOME?: GeneParameter
    }
  } = {
    limit: 10,
    offset: 0,
    sort: [{COUNT_ARTICLES : DIRECTION.DESC}]
  };

  getQuery(params :Params) {
    this.query = this._buildQuery(params);
    this._buildParams(params);
    return {query: this.query, params: this.params}
  }

  private _buildQuery(params: Params) {
    let query = gql`
      query DiseaseQuery($limit: Int, $offset: Int, $sort: [GARDSort!], $where: GARDWhere) {
        diseases: gards(limit: $limit, offset: $offset, sort: $sort, where: $where) {
          ...diseaseListFields
        }
        total: gardsAggregate(where: $where) {
          count
        }
      }
      ${DISEASELISTFIELDS}
    `;

    if (params['phenotypes'] || params['genes']) {
query = gql`
  query DiseaseQuery($limit: Int, $offset: Int, $sort: [GARDSort!], $where: GARDWhere) {
    diseases: filteredDiseases(limit: $limit, offset: $offset, sort: $sort, where: $where) {
      ...diseaseListFields
    }
    total: filteredDiseasesCount(where: $where)
  }
  ${DISEASELISTFIELDS}
`;
    }
    return query;
  }

  //todo: should there be text search for q instead of contains? =-- change query
  private _buildParams(params: Params) {
    this.params['limit'] = params['pageSize'] ? +(params['pageSize'] as number) : 10;
    this.params['offset'] = params['pageIndex'] ? +((params['pageIndex'] - 1) * +this.params['limit']) : 0;
    if (params['sort']) {
      this.params['sort'] = [{ [params['sort']]: params['direction'] ? params['direction'] as DIRECTION : DIRECTION.DESC },
      ];
    }

    if (params['q']) {
      if (!this.params.where) {
        this.params.where = { GardName_CONTAINS: params['q'] };
      } else {
        this.params.where['GardName_CONTAINS' as keyof typeof this.params.where] = params['q'];
      }
    }
    if(params['phenotypes']){
      if (!this.params.where) {
        this.params.where = {
          hasPhenotypePhenotypes_SOME: {
            HPOTerm_IN: params['phenotypes'].split('&'),
          }
        };
      } else {
        this.params.where.hasPhenotypePhenotypes_SOME
           = {HPOTerm_IN: params['phenotypes'].split('&')};
      }
    }
    if(params['genes']){
      if (!this.params.where) {
        this.params.where = {
          associatedWithGeneGenes_SOME: {
            GeneSymbol_IN: params['genes'].split('&'),
          }
        };
      } else {
        this.params.where.associatedWithGeneGenes_SOME =
          {GeneSymbol_IN: params['genes'].split('&')};
      }
    }
  }
}

export const DISEASELISTFIELDS = `
        fragment diseaseListFields on GARD {
      name:GardName
      gardId: GardId
      classificationLevel: ClassificationLevel
      disorderType: DisorderType
      synonyms: Synonyms
      articleCount: COUNT_ARTICLES
      geneCount: COUNT_GENES
      phenotypeCount: COUNT_PHENOTYPES
      projectCount: COUNT_PROJECTS
      clinicalTrialCount: COUNT_TRIALS
      }
`;

export const TREEROOTPARAMETERS = {
  where: {
    subClassOfGardsAggregate: {
      count: 0,
    },
    AND: [
      {
        DisorderType_NOT: 'Disease',
      },
    ],
  },
};

export const DISEASEBRANCHPARAMETERS: {
  searchString?: string;
  skip?: number;
  limit?: number;
  where?: {
    GardName_CONTAINS?: string | null | undefined;
    hasPhenotypePhenotypes_SOME?: {
      HPOTerm_IN?: string[];
    };
    associatedWithGeneGenes_SOME?: {
      GeneSymbol_IN?: string[];
    };
  };
} = {
  searchString: '',
  skip: 0,
  limit: 10,
};

export const CATEGORYTREEBRANCH = gql`
  query Tree($where: GARDWhere) {
    diseases: gards(where: $where) {
      ...diseaseListFields
      children: gardSsubClassOf {
        ...diseaseListFields
        _childrenCount: gardSsubClassOfAggregate {
          count
        }
      }
    }
  }
  ${DISEASELISTFIELDS}
`;

export const CATEGORYTREE = gql`
  query Tree($where: GARDWhere) {
    diseases: gards(where: $where) {
      ...diseaseListFields
      _childrenCount: gardSsubClassOfAggregate {
        count
      }
    }
  }
  ${DISEASELISTFIELDS}
`;

export const DISEASELIST = gql`
  query Tree($where: GARDWhere) {
    diseases: gards(where: $where) {
      ...diseaseListFields
    }
  }
  ${DISEASELISTFIELDS}
`;

export const FETCHPATH = gql`
  query Query($searchString: String) {
    treeBranch(searchString: $searchString)
  }
`;

export const FETCHROOT = gql`
  query Query {
    diseases: treeParent
  }
`;

export const FETCHPATHDISEASES = gql`
  query Query($searchString: String, $skip: Int, $limit: Int) {
    diseases: hierarchyDiseases(
      searchString: $searchString
      limit: $limit
      skip: $skip
    ) {
      ...diseaseListFields
    }
    total: hierarchyDiseasesCount(
      searchString: $searchString
      limit: $limit
      skip: $skip
    )
  }
  ${DISEASELISTFIELDS}
`;

export const DISEASETYPEAHEAD = gql`
  query Gards($searchString: String, $limit: Int) {
    diseaseSearch(searchString: $searchString, limit: $limit) {
      name: GardName
      gardId: GardId
      synonyms: Synonyms
    }
  }
`;

export const FETCHDISEASESLISTQUERY = gql`
  query Gards($options: GARDOptions, $where: GARDWhere) {
    diseases: gards(options: $options, where: $where) {
      ...diseaseListFields
    }
    total: gardsAggregate(where: $where) {
      count
    }
  }
  ${DISEASELISTFIELDS}
`;

export const FETCHDISEASEQUERY = gql`
  query Gards($where: GARDWhere) {
    disease: gards(where: $where) {
      name: GardName
      gardId: GardId
      classificationLevel: ClassificationLevel
      disorderType: DisorderType
      synonyms: Synonyms
      dataSource: DataSource
      dataSourceId: DataSourceId
      diseaseOntology: DiseaseOntology
      geneticAlliance: GeneticAlliance
      geneticsHomeReference: GeneticsHomeReference
      icd10: ICD10
      icd10cm: ICD10CM
      icd11: ICD11
      mesh: MeSH
      medra: MedDRA
      omim: OMIM
      orphanet: Orphanet
      snomed: SNOMEDCT
      umls: UMLS
      associatedWithGeneGenesAggregate {
        count
      }
      _geneAssociations: associatedWithGeneGenesConnection {
        edges {
          properties {
            associationStatus: AssociationStatus
            associationType: AssociationType
            _reference: Reference
          }
          gene: node {
            ensembl: Ensembl
            geneIdentifier: GeneIdentifier
            geneSymbol: GeneSymbol
            iuphar: IUPHAR
            locus: Locus
            geneTitle: GeneTitle
            geneSynonyms: GeneSynonyms
            omim: OMIM
            reactome: Reactome
            swissprot: Swissprot
          }
        }
      }
      _genesCount: associatedWithGeneGenesAggregate {
        count
      }
      _phenotypesCount: hasPhenotypePhenotypesAggregate {
        count
      }

      _phenotypeAssociations: hasPhenotypePhenotypesConnection {
        edges {
          properties {
            hpoFrequency: HPOFrequency
            status: ValidationStatus
            _evidence: Evidence
            _reference: Reference
          }
          phenotype: node {
            hpoId: HPOId
            hpoTerm: HPOTerm
            modifier: Modifier
            online: Online
            onset: Onset
            sex: Sex
          }
        }
      }
    }
    total: gardsAggregate(where: $where) {
      count
    }
  }
`;

export const DISEASEQUERYPARAMETERS: {
  where?: {
    GardId?: null | string;
    hasPhenotypePhenotypes_SOME?: { HPOTerm_IN: string[] };
    associatedWithGeneGenes_SOME?: { GeneSymbol_IN: string[] };
    AND?: [
      {
        hasPhenotypePhenotypes_SOME?: {
          HPOTerm_IN?: string[];
        };
      },
      {
        associatedWithGeneGenes_SOME?: {
          GeneSymbol_IN?: string[];
        };
      }
    ];
  };
} = {
  where: { GardId: null },
};

export const LISTQUERYPARAMETERS: {
  options: {
    limit?: number;
    offset?: number;
    sort?: [{ [key: string]: string }];
  };
  where?: {
    GardName_CONTAINS?: string | null | undefined;
    hasPhenotypePhenotypes_SOME?: {
      HPOTerm_IN?: string[];
    };
    associatedWithGeneGenes_SOME?: {
      GeneSymbol_IN?: string[];
    };
    AND?: unknown[];
  };
} = {
  options: {
    limit: 10,
    offset: 0,
    sort: [
      {
        COUNT_ARTICLES: 'DESC',
      },
    ],
  },
};
