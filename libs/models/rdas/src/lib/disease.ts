import { Article } from './article';
import { ClinicalTrial } from './clinical-trial';
import { Gene, GeneAssociation } from './gene';
import { Phenotype, PhenotypeAssociation } from './phenotype';
import { CoreProject } from './project';

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
  synonyms?: string[];
  umls?: string[];
  allArticles?: Article[];
  epiArticles?: Article[];
  nhsArticles?: Article[];
  allEpiCount = 0; //todo need 2 counts to preserve counts in sidebar for filtering
  epiCount = 0;
  allArticleCount = 0;
  articleCount = 0;
  allNhsCount = 0;
  nhsCount = 0;
  projects?: CoreProject[];
  projectCount = 0;
  allProjectCount = 0;
  clinicalTrials?: ClinicalTrial[];
  allClinicalTrialCount = 0;
  clinicalTrialCount = 0;
  geneAssociations?: GeneAssociation[];
  _geneAssociations?: { edges?: Partial<GeneAssociation>[] };
  phenotypeAssociations?: PhenotypeAssociation[];
  _phenotypeAssociations?: { edges?: Partial<PhenotypeAssociation>[] };
  geneCount: number | undefined = 0;
  phenotypeCount = 0;
  parentId?: string;
  _genesCount?: { count?: number; low: 0 };
  _phenotypesCount?: { count: number; low: 0 };
  _epiCount?: { count: number };
  _allArticleCount?: { count: number };
  _nhsCount?: { count: number };
  _childrenCount?: { count?: number; low: 0 };

  constructor(obj: Partial<Disease>) {
    Object.assign(this, obj);

    if (obj.allArticles) {
      this.allArticles = obj.allArticles.map(
        (article: Partial<Article> = {}) => new Article(article)
      );
    }

    if (obj._allArticleCount) {
      this.allArticleCount = obj._allArticleCount.count;
      delete this._allArticleCount;
    }
    if (obj.epiArticles) {
      this.epiArticles = obj.epiArticles.map(
        (article: Partial<Article> = {}) => new Article(article)
      );
    }
    if (obj._epiCount) {
      this.epiCount = obj._epiCount.count;
      delete this._epiCount;
    }

    if (obj.nhsArticles) {
      this.nhsArticles = obj.nhsArticles.map(
        (article: Partial<Article> = {}) => new Article(article)
      );
    }

    if (obj._nhsCount) {
      this.nhsCount = obj._nhsCount.count;
      delete this._nhsCount;
    }

    if (obj._geneAssociations && obj._geneAssociations.edges) {
      this.geneAssociations = obj._geneAssociations.edges
        .map(
          (data: unknown) =>
            new GeneAssociation(
              data as {
                gene: Partial<Gene>;
                properties: Partial<GeneAssociation>;
              }
            )
        )
        .sort((a, b) => b.associationType.localeCompare(a.associationType));
      delete this._geneAssociations;
    }

    if (obj._phenotypeAssociations && obj._phenotypeAssociations.edges) {
      this.phenotypeAssociations = obj._phenotypeAssociations.edges
        .map(
          (data: unknown) =>
            new PhenotypeAssociation(
              data as {
                phenotype: Partial<Phenotype>;
                properties: Partial<PhenotypeAssociation>;
              }
            )
        )
        .sort((a, b) => b.frequencyRank - a.frequencyRank);

      delete this._phenotypeAssociations;
    }

    if (obj._genesCount && obj._genesCount.count) {
      this.geneCount = obj._genesCount.count;
      delete this._genesCount;
    }

    if (obj._phenotypesCount && obj._phenotypesCount.count) {
      this.phenotypeCount = obj._phenotypesCount.count;
      delete this._phenotypesCount;
    }

    if (obj.synonyms) {
      this.synonyms = [...new Set(obj.synonyms)];
    }
  }
}

export class DiseaseNode {
  classificationLevel?: string;
  disorderType?: string[];
  name?: string;
  gardId!: string;
  childrenCount = 0;
  children!: DiseaseNode[];
  _childrenCount?: { count: 0; low: 0 };

  constructor(obj: Partial<DiseaseNode>) {
    Object.assign(this, obj);

    if (obj?._childrenCount && obj._childrenCount.count) {
      this.childrenCount = obj._childrenCount.count;
    }

    if (obj?._childrenCount && obj._childrenCount.low) {
      this.childrenCount = obj._childrenCount.low;
    }

    if (obj?.children) {
      this.children = obj.children
        .map((c) => new DiseaseNode(c))
        .sort((a, b) => b.childrenCount - a.childrenCount);
      this.childrenCount = obj.children.length;
    }
  }
}
