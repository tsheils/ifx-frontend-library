import { gql } from 'apollo-angular';

//pubType

export const ARTICLEFIELDS = `
  fragment articleFields on Article {
    abstractText
    affiliation
    citedByCount
    doi
    firstPublicationDate
    isEpi
    isNHS
    pubmed_id
    source
    title
    journals: appearsInJournalVolumes {
        dateOfPublication
        printPublicationDate
        volume
        _title: contentOfJournals {
          title
        }
      }
  }
`;

export const FETCHARTICLESQUERY = gql`
  query Articles(
    $gardWhere: GARDWhere
    $articleFilter: ArticleWhere
    $articleOptions: ArticleOptions
  ) {
    articlesData: gards(where: $gardWhere) {
      GardId
      _count: mentionedInArticlesAggregate(where: $articleFilter) {
        count
      }

      epiCount: mentionedInArticlesAggregate(where: { isEpi: true }) {
        count
      }

      nhsCount: mentionedInArticlesAggregate(where: { isNHS: true }) {
        count
      }

      articlesList: mentionedInArticles(
        options: $articleOptions
        where: $articleFilter
      ) {
        ...articleFields
      }
    }
  }
  ${ARTICLEFIELDS}
`;

class ARTICLEVARIABLES {
  gardWhere!: { GardId: undefined | string };
  articleWhere?: {
    isEpi?: null | boolean;
    isNHS?: null | boolean;
  };
  articleFilter!: {
    isEpi?: null | boolean;
    isNHS?: null | boolean;
    publicationYear_IN?: undefined | string[] | string;
  };
  articleOptions!: {
    limit: number;
    offset?: number;
    sort: [{ firstPublicationDate?: string }];
  };
  meshTermsMeshTermForArticleOptions?: { limit?: number };
}

export const EPIARTICLES: ARTICLEVARIABLES = {
  gardWhere: { GardId: undefined },
  articleWhere: {
    isEpi: true,
  },
  articleFilter: {
    isEpi: true,
  },
  articleOptions: {
    limit: 10,
    sort: [
      {
        firstPublicationDate: 'DESC',
      },
    ],
  },
};

export const NHSARTICLES: ARTICLEVARIABLES = {
  gardWhere: { GardId: undefined },
  articleWhere: {
    isNHS: true,
  },
  articleFilter: {
    isNHS: true,
  },
  articleOptions: {
    limit: 10,
    sort: [
      {
        firstPublicationDate: 'DESC',
      },
    ],
  },
};

export const ALLARTICLES: ARTICLEVARIABLES = {
  gardWhere: { GardId: undefined },
  articleWhere: {},
  articleFilter: {
    publicationYear_IN: undefined,
  },
  articleOptions: {
    limit: 10,
    sort: [
      {
        firstPublicationDate: 'DESC',
      },
    ],
  },
};

export const NONEPIARTICLES: ARTICLEVARIABLES = {
  gardWhere: { GardId: undefined },
  articleWhere: {
    isEpi: false,
  },
  articleFilter: {
    isEpi: false,
    publicationYear_IN: undefined,
  },
  articleOptions: {
    limit: 10,
    sort: [
      {
        firstPublicationDate: 'DESC',
      },
    ],
  },
};

export const FETCHARTICLEDETAILS = gql`
  query ArticleDetails($articleWhere: ArticleWhere) {
    articles(where: $articleWhere) {
      ...articleFields
      authorsWrote {
        firstName
        lastName
        fullName
      }
      epidemiologies: epidemiologyAnnotationsEpidemiologyAnnotationFor {
        epidemiology_rate
        epidemiology_type
        ethnicity
        location
        sex
      }
      journals: appearsInJournalVolumes {
        dateOfPublication
        printPublicationDate
        volume
        _title: contentOfJournals {
          title
        }
      }
      diseases: gardsmentionedIn {
        gardId: GardId
        name: GardName
      }
      sources: fullTextUrlsContentFor {
        availability
        documentStyle
        site
        url
      }
      keywords: keywordsKeywordFor {
        keyword
      }
      meshTerms: meshTermsMeshTermFor {
        descriptorName
        #  majorTopic_YN
        _qualifier: meshQualifiersMeshQualifierFor {
          abbreviation
          qualifierName
        }
      }
      annotations: pubtatorAnnotationsAnnotationFor {
        infons_identifier
        infons_type
        type
        text
      }
      substances: substancesSubstanceAnnotatedByPubmed {
        name
        registryNumber
      }
    }
  }
  ${ARTICLEFIELDS}
`;

export const ARTICLEDETAILSVARIABLES: {
  articleWhere: {
    pubmed_id: null | undefined | string;
  };
} = {
  articleWhere: {
    pubmed_id: '',
  },
};

export const ARTICLEFILTERS = gql`
  query ArticleFilters($gardId: String) {
    countsByYear(gardId: $gardId) {
      term
      count
      label
    }
    countsByEpi(gardId: $gardId) {
      term
      count
      label
    }
    countsByNHS(gardId: $gardId) {
      term
      count
      label
    }
  }
`;

export const ALLARTICLEFILTERS = gql`
  query AllDiseaseFilters {
    allCountsByYear {
      count
      label
      term
    }
  }
`;
