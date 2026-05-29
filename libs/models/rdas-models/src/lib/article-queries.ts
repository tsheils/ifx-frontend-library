import { gql } from 'apollo-angular';
import {
  DIRECTION,
  RdasQueryFactory,
  RdasQueryParams
} from "rdas-models";
import {TypedDocumentNode} from "@apollo/client";
import {Params} from "@angular/router";


export const ARTICLEQUERY = gql`
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
        where: { NOT: { annotationType: { in: ["Species", "Genus"] } } }
      ) {
        annotationIdentifier
        annotationType
        annotation
      }
    }
  }
`;

export const ARTICLELISTQUERY = gql`
  query ArticleListQuery(
    $diseaseWhere: DiseaseWhere
    $hasMentionInLimit: Int
    $hasMentionInOffset: Int
    $hasMentionInSort: [ArticleSort!]
    $articleWhere: ArticleWhere
    $hasMentionInConnectionWhere: DiseaseHasMentionInConnectionWhere
  ) {
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


export class ArticleWhereParams extends RdasQueryParams {
  diseaseWhere?: {
    gardId: {
      eq: string
  }
  }
  articleWhere?: {
    pubmedId: {
      eq: number
  }
  }

  /*hasMentionInConnectionWhere?: {
    node: {
      [key:string]: {eq: boolean}
    },
    AND?:  {[key:string]: {eq: boolean}}[]

  }
  hasMentionInWhere?: {
    AND?: {[key:string]: {eq: boolean}}[]
  //  [key:string]: {eq: boolean};
  }*/
  hasMentionInLimit?: number
  hasMentionInOffset?: number
  hasMentionInSort?: [{ [key: string]: DIRECTION }]
}

export class ArticleQueryFactory implements RdasQueryFactory {
  query!: TypedDocumentNode<unknown, unknown>;
  params: ArticleWhereParams = {};

  getQuery(params: Params) {
    this.query = this._buildQuery(params);
    this._buildParams(params);
    return {query: this.query, params: this.params};
  }

  _buildQuery(params: Params) {
    if (params['pubmedId']) {
      return ARTICLEQUERY
    } else {
      this.params = {
        hasMentionInLimit: 10,
        hasMentionInOffset: 0,
        sort: [{ publicationYear: DIRECTION.DESC }],
      };
      return ARTICLELISTQUERY
    }
  }

  _buildParams(params: Params) {
    if(params['offset']) {
    this.params.hasMentionInOffset = +params['offset']
      }

    if (params['sort']) {
      this.params['hasMentionInSort'] = [
        {
          [params['sort']]: params['direction']
            ? (params['direction'] as DIRECTION)
            : DIRECTION.DESC,
        },
      ];
    }
      if (params['pubmedId']) {
        this.params.articleWhere = {pubmedId: {eq: +params['pubmedId']}};
      }

    if (params['gardId']) {
      this.params.diseaseWhere = {gardId: {eq: params['gardId']}};
    }
/*
    if (params['isNHS'] || params['isEpi']) {
      console.log("yoyoyoy")
      this.params.hasMentionInConnectionWhere = {node: {}}
      if (params['isNHS']) {
        this.params.hasMentionInConnectionWhere!.node!['isNaturalHistoryStudy'].eq = params['isNHS']
        this.params.hasMentionInWhere!['isNaturalHistoryStudy']!.eq = params['isNHS']

        if (params['isEpi']) {
          this.params.hasMentionInConnectionWhere!['AND'] = [{isEpidemiologicalStudy: {eq: params['isEpi']}}]
        }
      }

      if (params['isEpi']) {
        this.params.hasMentionInConnectionWhere!.node['isEpidemiologicalStudy'].eq = params['isEpi']
      }

      if (params['isNHS']) {
        this.params.hasMentionInConnectionWhere!['AND'] = []
        this.params.hasMentionInConnectionWhere!['AND']!.push({isNaturalHistoryStudy: {eq: params['isNHS']}})
      }
    }*/
  }

}
