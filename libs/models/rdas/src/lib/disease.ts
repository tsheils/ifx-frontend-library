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
  _childrenCount?: {count: number};

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

export class DiseaseNode {
  classificationLevel?: string;
  disorderType?: string;
  name!: string;
  gardId!: string;
  childrenCount = 0;
  children!: DiseaseNode[];
  _childrenCount?: { count: number };

  constructor(obj: Partial<DiseaseNode>) {
    Object.assign(this, obj);

    if (obj._childrenCount) {
      this.childrenCount = obj._childrenCount.count;
    }

    if(obj.children) {
      this.children = obj.children.map(c => new DiseaseNode(c)).sort((a,b) => b.childrenCount - a.childrenCount)
      this.childrenCount = obj.children.length;
    }
  }

  mergeChildren(parent: DiseaseNode, data: DiseaseNode): DiseaseNode {

    if (parent.gardId === data.gardId) {
      parent = data;
    } else if (parent.children) {
      let found = false;
      parent.children.map(child => {
        if(child.gardId === data.gardId) {
          child.children = data.children;
          found = true;
        }
        return child;
      });
      if(found){
        return parent;
      } else {
        parent.children.map(child => this.mergeChildren(child, data));
      }
    }
    return parent;
  }
}
