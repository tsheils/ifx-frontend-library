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
  projects?: CoreProject[];
  projectCount = 0;
  clinicalTrials?: ClinicalTrial[];
  clinicalTrialsCount = 0;
  parentId?: string;
  _epiCount?: {count: number};
  _nonEpiCount?: {count: number};
  _childrenCount?: {count?: number, low: 0};

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

    if(obj.synonyms) {
      this.synonyms = [...new Set(obj.synonyms)];
    }

  }
}

export class DiseaseNode {
  classificationLevel?: string;
  disorderType?: string;
  name!: string;
  gardId!: string;
  childrenCount = 0;
  children!: DiseaseNode[];
  _childrenCount?: { count: 0, low: 0 };

  constructor(obj: Partial<DiseaseNode>) {
    Object.assign(this, obj);

    if (obj?._childrenCount && obj._childrenCount.count) {
      this.childrenCount = obj._childrenCount.count;
    }

    if (obj?._childrenCount && obj._childrenCount.low) {
      this.childrenCount = obj._childrenCount.low;
    }


    if(obj?.children) {
      this.children = obj.children.map(c => new DiseaseNode(c)).sort((a,b) => b.childrenCount - a.childrenCount)
      this.childrenCount = obj.children.length;
    }
  }
}

