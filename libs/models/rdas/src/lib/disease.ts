import {gql} from "apollo-angular";
import { Article } from "./article";
import {ClinicalTrial} from "./clinical-trial";
import { CoreProject } from "./project";

export class Disease {
  classificationLevel?: string;
  disorderType?: string;
  name!: string;
  gardId!: string;
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
  projects?: CoreProject[];
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
