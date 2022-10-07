import {gql} from "apollo-angular";
import { Article, ARTICLEFIELDS } from "./article";
import { AUTHORFIELDS } from "./author";
import {ClinicalTrial} from "./clinical-trial";
import {Project} from "./project";

export class Disease {
  name!: string;
  gard_id!: string;
  all_ids?:  string[];
  all_names?: string[];
  categories?: string[];
  is_rare?: boolean;
  synonyms?:  string[];
  epiArticles?: Article[];
  nonEpiArticles?: Article[];
  epiCount = 0;
  nonEpiCount = 0;
  _epiCount?: {count: number};
  _nonEpiCount?: {count: number};
  projects?: Project[];
  projectCount = 0;
  clinicalTrials?: ClinicalTrial[];
  clinicalTrialsCount = 0;

  constructor(obj: Partial<Disease>) {
    Object.assign(this, obj);

    if(obj.epiArticles) {
      this.epiArticles = obj.epiArticles.map((article: Partial<Article> = {}) => new Article(article));
    }

    if(obj.nonEpiArticles) {
      this.nonEpiArticles = obj.nonEpiArticles.map((article: Partial<Article> = {}) => new Article(article));
    }

    if(obj._epiCount) {
      this.epiCount = obj._epiCount.count;
    }
    if(obj._nonEpiCount) {
      this.nonEpiCount = obj._nonEpiCount.count;
    }
  }
}



const DISEASEFIELDS = gql`
  fragment diseaseFields on Disease {
    gard_id
    name
    all_ids
    synonyms
    _epiCount: mentionedInArticlesAggregate(
      where: {isEpi: "Y"}
    ) {
      count
    }
    _nonEpiCount: mentionedInArticlesAggregate(
      where: {isEpi: null}
    ) {
      count
    }
  }
`;

export const FETCHDISEASESLISTQUERY = gql`
  query Diseases($options: DiseaseOptions) {
    diseases(options: $options) {
      name
      gard_id
      is_rare
      synonyms
      mentionedInArticlesAggregate {
        count
      }
    }
    total: diseasesAggregate {
      count
    }
  }
`

export const FETCHDISEASEQUERY = gql`
  query Diseases(
    $diseasesWhere: DiseaseWhere
    $mentionedInEpiArticlesOptions: ArticleOptions
    $mentionedInEpiArticlesWhere: ArticleWhere
    $meshTermsMeshTermForEpiOptions: MeshTermOptions
    $mentionedInNonEpiArticlesOptions: ArticleOptions
    $mentionedInNonEpiArticlesWhere: ArticleWhere
    $meshTermsMeshTermForNonEpiOptions: MeshTermOptions
  ) {
    diseases(where: $diseasesWhere) {
      ...diseaseFields
      epiArticles: mentionedInArticles(
        options: $mentionedInEpiArticlesOptions
        where: $mentionedInEpiArticlesWhere
      ) {
        ...articleFields
        authorsWrote {
          ...authorFields
        }
        meshTermsMeshTermForAggregate {
          count
        }
        meshTermsMeshTermFor(options: $meshTermsMeshTermForEpiOptions) {
          descriptorName
          majorTopic_YN
        }
      }
      nonEpiArticles: mentionedInArticles(
        options: $mentionedInNonEpiArticlesOptions
        where: $mentionedInNonEpiArticlesWhere
      ) {
        ...articleFields
        authorsWrote {
          ...authorFields
        }
        meshTermsMeshTermForAggregate {
          count
        }
        meshTermsMeshTermFor(options: $meshTermsMeshTermForNonEpiOptions) {
          descriptorName
          majorTopic_YN
        }
      }
    }
  }
  ${DISEASEFIELDS}
  ${ARTICLEFIELDS}
  ${AUTHORFIELDS}
`;

export const LISTQUERYPARAMETERS: {
  options: {
    limit?: number,
    offset?: number,
    sort?: [{ [key: string]: string }]
  }
  } =
  {
    options: {
      limit: 10,
      offset: 0,
      sort: [
        {
          name: "ASC"
        }
      ]
    }
  }
;
