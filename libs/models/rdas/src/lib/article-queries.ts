import { gql } from "apollo-angular";


export const ARTICLEFIELDS = `
  fragment articleFields on Article {
    abstractText
    firstPublicationDate
    hasPDF
    inEPMC
    inPMC
    isEpi
    isOpenAccess
    omim_evidence
    pubType
    pubmed_evidence
    pubmed_id
    refInOMIM
    source
    title
    doi
    citedByCount
    affiliation
  }
`;

/*
export const FETCHARTICLESQUERY = gql`
query Articles(
  $epiWhere: ArticleWhere,
  $nonEpiWhere: ArticleWhere,
  $epiOptions: ArticleOptions,
  $nonEpiOptions: ArticleOptions
) {
  _epiCount: articlesAggregate(where: $epiWhere) {
    count
  }
  _nonEpiCount: articlesAggregate(where: $nonEpiWhere) {
    count
  }
  epiArticles: articles(
    options: $epiOptions
  where: $epiWhere
) {
    ...articleFields
    authorsWrote {
      firstName
      lastName
      fullName
    }
    meshTermsMeshTermForAggregate {
      count
    }
  }
  nonEpiArticles: articles(
    options: $nonEpiOptions
  where: $nonEpiWhere
) {
    ...articleFields
    authorsWrote {
      firstName
      lastName
      fullName
    }
    meshTermsMeshTermForAggregate {
      count
    }
  }
}
${ARTICLEFIELDS}
`;
*/
export const FETCHARTICLESQUERY = gql`
query Articles(
  $gardWhere: DiseaseWhere,
  $epiWhere: ArticleWhere,
  $nonEpiWhere: ArticleWhere,
  $epiOptions: ArticleOptions,
  $nonEpiOptions: ArticleOptions
) {
    articles:diseases(where: $gardWhere) {
        _epiCount: mentionedInArticlesAggregate(where: $epiWhere) {
            count
        }
        _nonEpiCount: mentionedInArticlesAggregate(where: $nonEpiWhere) {
            count
        }
        epiArticles: mentionedInArticles(
            options: $epiOptions
            where: $epiWhere
        ) {
            ...articleFields
            authorsWrote {
                firstName
                lastName
                fullName
            }
            meshTermsMeshTermForAggregate {
                count
            }
        }
        nonEpiArticles: mentionedInArticles(
            options: $nonEpiOptions
            where: $nonEpiWhere
        ) {
            ...articleFields
            authorsWrote {
                firstName
                lastName
                fullName
            }
            meshTermsMeshTermForAggregate {
                count
            }
        }
    }
}
${ARTICLEFIELDS}
`;



export const ARTICLEVARIABLES: {
  gardWhere: {gard_id?: null | string }
  epiWhere: {
        isEpi?: null | string
  },
  epiOptions?: {
    limit?: number,
    sort?: [{ firstPublicationDate?: string }]
  },
  meshTermsMeshTermForEpiOptions?: {limit?: number},
  nonEpiWhere: {
    isEpi?: null | string
  },
  nonEpiOptions?: {
    limit?: number,
    sort?: [{ firstPublicationDate?: string }]
  },

  meshTermsMeshTermForNonEpiOptions?: {limit: number}
} = {
  gardWhere: {gard_id: null},
  epiWhere: {
        isEpi: "Y"
  },
  epiOptions: {
    limit: 10,
    sort: [
      {
        firstPublicationDate: "DESC"
      }
    ]
  },
  nonEpiWhere: {
        isEpi: null
  },
  meshTermsMeshTermForEpiOptions: {limit: 10},
  nonEpiOptions: {
    limit: 10,
    sort: [
      {
        firstPublicationDate: "DESC"
      }
    ]
  },
  meshTermsMeshTermForNonEpiOptions: {limit: 10}
}

