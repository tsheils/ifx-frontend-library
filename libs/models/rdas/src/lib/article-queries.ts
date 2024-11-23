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
    authorsWrote {
                firstName
                lastName
                fullName
            }
  }
`;

export const FETCHARTICLESQUERY = gql`
  query Articles(
    $gardWhere: GARDWhere
    $articleWhere: ArticleWhere
    $articleFilter: ArticleWhere
    $articleOptions: ArticleOptions
  ) {
    articles: gards(where: $gardWhere) {
      _count: mentionedInArticlesAggregate(where: $articleFilter) {
        count
      }

      allCount: mentionedInArticlesAggregate(where: $articleWhere) {
        count
      }

      articles: mentionedInArticles(
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
  articleWhere!: {
    isEpi?: null | string | boolean;
    isNHS?: null | string | boolean;
  };
  articleFilter!: {
    isEpi?: null | string | boolean;
    isNHS?: null | string | boolean;
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
