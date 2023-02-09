import { gql } from "apollo-angular";


export const ARTICLEFIELDS = `
  fragment articleFields on Article {
    abstractText
    affiliation
    citedByCount
    doi
    firstPublicationDate
    isEpi
    pubType
    pubmed_id
    source
    title
    pubType
    pubmed_id
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
          journals: appearsInJournalVolumes {
            dateOfPublication
            printPublicationDate
            volume
            _title: contentOfJournals {
              title
            }
          }
          diseases: diseasesMentionedIn {
            gardId: gard_id
            name
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
            isMajorTopic
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
          journals: appearsInJournalVolumes {
            dateOfPublication
            printPublicationDate
            volume
            contentOfJournals {
              title
            }
          }
          diseases: diseasesMentionedIn {
            gardId: gard_id
            name
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
            isMajorTopic
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

export const FETCHARTICLECOUNTS = gql`
query ArticleCount($diseasesWhere: DiseaseWhere) {
  diseases(where: $diseasesWhere) {
    gard_id
    mentionedInArticlesAggregate {
      count
    }
  }
}
`
