import { gql } from "apollo-angular";

//pubType

export const ARTICLEFIELDS = `
  fragment articleFields on Article {
    abstractText
    affiliation
    citedByCount
    doi
    firstPublicationDate
    isEpi
    pubmed_id
    source
    title
  }
`;
export const FETCHARTICLESQUERY = gql`
query Articles(
  $gardWhere: GARDWhere,
  $epiWhere: ArticleWhere,
  $nonEpiWhere: ArticleWhere,
  $epiOptions: ArticleOptions,
  $nonEpiOptions: ArticleOptions
) {
    articles:gards(where: $gardWhere) {
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
          diseases: gardsmentionedIn {
            gardId: GardId
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
          #  isMajorTopic
            _qualifier: meshQualifiersMeshQualifierFor {
              abbreviation
              qualifierName
            }
          }
          annotations: pubtatorAnnotationsAnnotationFor {
            infons_identifier
            infons_type
            type
           # text
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
  gardWhere: {GardId?: null | string }
  epiWhere: {
        isEpi?: null | string | boolean
  },
  epiOptions?: {
    limit?: number,
    sort?: [{ firstPublicationDate?: string }]
  },
  meshTermsMeshTermForEpiOptions?: {limit?: number},
  nonEpiWhere: {
    isEpi?: null | boolean
  },
  nonEpiOptions?: {
    limit?: number,
    sort?: [{ firstPublicationDate?: string }]
  },

  meshTermsMeshTermForNonEpiOptions?: {limit: number}
} = {
  gardWhere: {GardId: null},
  epiWhere: {
        isEpi:  true
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
        isEpi: false
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
query ArticleCount($diseasesWhere: GARDWhere) {
  diseases(where: $diseasesWhere) {
    GardId
    mentionedInArticlesAggregate {
      count
    }
  }
}
`

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
`

export const ARTICLEDETAILSVARIABLES: {
  articleWhere: {
    pubmed_id: null | undefined | string;
  }
} = {
  articleWhere:
    {
      pubmed_id: ''
    }
}
