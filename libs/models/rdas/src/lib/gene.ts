import { Reference } from './reference';

export class Gene {
  ensembl?: string;
  geneSymbol!: string;
  geneIdentifier!: string;
  geneSynonyms?: string;
  geneTitle!: string;
  locus!: string;
  omim?: string;
  swissprot?: string;
  reactome?: string;

  constructor(obj: Partial<Gene> = {}) {
    Object.assign(this, obj);
  }
}

export class GeneAssociation {
  associationStatus!: string;
  associationType!: string;
  reference?: Reference[];
  gene!: Gene;
  _reference?: string[];

  constructor(obj: {
    gene?: Partial<Gene>;
    properties?: Partial<GeneAssociation>;
  }) {
    Object.assign(this, obj.properties);

    if (obj.gene) {
      this.gene = new Gene(obj.gene);
    }

    if (obj.properties && obj.properties._reference) {
      this.reference = obj.properties._reference.map(
        (ref) => new Reference({ code: ref })
      );
      delete this._reference;
    }
  }

  _toString() {
    return `${this.gene.geneSymbol}\t ${this.associationStatus}\t${
      this.associationType
    }\t${this.reference?.map((ref) => ref._toString()).join('|')}`;
  }
}
