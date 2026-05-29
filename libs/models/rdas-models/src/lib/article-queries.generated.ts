import * as Types from './**/libs/models/rdas-models/src/lib/**/generated-types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export const ArticleQueryDocument = gql`
    query ArticleQuery($articleWhere: ArticleWhere) {
  articles(where: $articleWhere) {
    abstractText
    citationCount
    dateCreatedByRDAS
    doi
    firstPublicationDate
    inEPMC
    inPMC
    isEpidemiologicalStudy
    isNaturalHistoryStudy
    isOpenAccess
    issue
    lastUpdatedDateByRDAS
    publicationYear
    pubmedId
    pubType
    title
    volume
    journals: hasJournal {
      essn
      issn
      nlmid
      title
    }
    diseases: hasMentionIn {
      gardId
      gardName
    }
    meshTerms: hasMeshTerm {
      meshTerm
    }
    substances: hasSubstance {
      name
      registryNumber
    }
    authors: hasAuthor {
      fullName
      firstName
      contactEmail
      hasAffiliation {
        name
      }
      lastName
      orc_id
      pi_id
    }
    epidemiologies: hasEpidemiologicalAnnotation {
      epidemiologyRate
      studyDate
      studyLocation
      sex
      lastUpdatedByRDAS
      ethnicity
      epidemiologyType
    }
    annotations: hasPubtatorAnnotation(
      where: {NOT: {annotationType: {in: ["Species", "Genus"]}}}
    ) {
      annotationIdentifier
      annotationType
      annotation
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ArticleQueryGQL extends Apollo.Query<ArticleQueryQuery, ArticleQueryQueryVariables> {
    document = ArticleQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ArticleListQueryDocument = gql`
    query ArticleListQuery($diseaseWhere: DiseaseWhere, $hasMentionInLimit: Int, $hasMentionInOffset: Int, $hasMentionInSort: [ArticleSort!], $articleWhere: ArticleWhere, $hasMentionInConnectionWhere: DiseaseHasMentionInConnectionWhere) {
  diseases(where: $diseaseWhere) {
    countArticles
    countEpiArticles
    countNhsArticles
    articles: hasMentionIn(
      limit: $hasMentionInLimit
      offset: $hasMentionInOffset
      sort: $hasMentionInSort
      where: $articleWhere
    ) {
      pubmedId
      title
      publicationYear
      doi
      firstPublicationDate
      pubType
      isNaturalHistoryStudy
      isEpidemiologicalStudy
      journals: hasJournal {
        essn
        issn
        nlmid
        title
      }
    }
    allCount: hasMentionInConnection(where: $hasMentionInConnectionWhere) {
      totalCount
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ArticleListQueryGQL extends Apollo.Query<ArticleListQueryQuery, ArticleListQueryQueryVariables> {
    document = ArticleListQueryDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }