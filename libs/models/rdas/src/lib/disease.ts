import {gql} from "apollo-angular";
import { Article } from "./article";
import {ClinicalTrial} from "./clinical-trial";
import { Gene, GeneAssociation } from "./gene";
import { Phenotype, PhenotypeAssociation } from "./phenotype";
import { CoreProject } from "./project";

export class Disease {
  classificationLevel?: string;
  dataSource!: string;
  dataSourceId!: string;
  diseaseOntology?: string[];
  disorderType?: string[];
  name!: string;
  gardId!: string;
  geneticAlliance?: string[];
  geneticsHomeReference?: string[];
  icd10?: string[];
  icd10cm?: string[];
  icd11?: string[];
  mesh?: string[];
  medra?: string[];
  omim?: string[];
  orphanet?: string[];
  snomed?: string[];
  synonyms?:  string[];
  umls?: string[];

 /* all_ids?:  string[];
  all_names?: string[];
  categories?: string[];
  is_rare?: boolean;*/
  epiArticles?: Article[];
  nonEpiArticles?: Article[];
  epiCount = 0;
  nonEpiCount = 0;
  projects?: CoreProject[];
  projectCount = 0;
  clinicalTrials?: ClinicalTrial[];
  clinicalTrialsCount = 0;
  geneAssociations?: GeneAssociation[];
  _geneAssociations?: {edges?: Partial<GeneAssociation>[]};
  phenotypeAssociations?: PhenotypeAssociation[];
  _phenotypeAssociations?: {edges?: Partial<PhenotypeAssociation>[]};
  geneCount: number | undefined = 0;
  phenotypesCount = 0;
  parentId?: string;
  _genesCount?: {count?: number, low: 0};
  _phenotypesCount?: {count: number, low: 0};
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

    if(obj._geneAssociations && obj._geneAssociations.edges ) {
      this.geneAssociations = obj._geneAssociations.edges.map((gene: Partial<GeneAssociation> = {}) => new GeneAssociation(gene));
      delete this._geneAssociations;
    }

  if(obj._phenotypeAssociations && obj._phenotypeAssociations.edges ) {
      this.phenotypeAssociations = obj._phenotypeAssociations.edges.map((gene: Partial<PhenotypeAssociation> = {}) => new PhenotypeAssociation(gene));
      delete this._phenotypeAssociations;
    }

    if(obj._epiCount) {
      this.epiCount = obj._epiCount.count;
      delete this._epiCount
    }

    if(obj._genesCount &&  obj._genesCount.count) {
      this.geneCount = obj._genesCount.count;
      delete this._genesCount
    }

    if(obj._phenotypesCount &&  obj._phenotypesCount.count) {
      this.phenotypesCount = obj._phenotypesCount.count;
      delete this._phenotypesCount;
    }

    if(obj._nonEpiCount) {
      this.nonEpiCount = obj._nonEpiCount.count;
      delete this._nonEpiCount
    }

    if(obj.synonyms) {
      this.synonyms = [...new Set(obj.synonyms)];
    }

  }
}

export class DiseaseNode {
  classificationLevel?: string;
  disorderType?: string[];
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

