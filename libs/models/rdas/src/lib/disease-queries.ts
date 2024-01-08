import { gql } from 'apollo-angular';

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
  query Gards($searchString: String, $limit:Int) {
    diseaseSearch(searchString: $searchString, limit: $limit) {
      name: GardName
      gardId: GardId
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
          associationStatus: AssociationStatus
          associationType: AssociationType
          _reference: Reference
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
          hpoFrequency: HPOFrequency
          status: ValidationStatus
          _evidence: Evidence
          _reference: Reference
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
