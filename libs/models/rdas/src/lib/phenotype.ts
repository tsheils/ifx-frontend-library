import { Reference } from "./reference";

export class Phenotype {
  hpoId!: string;
  hpoTerm!: string;
  modifier?: string;
  online?: boolean;
  onset?: string;
  sex?: string;



  constructor(obj: Partial<Phenotype> = {}) {
    Object.assign(this, obj);
  }
}

export class PhenotypeAssociation {
  evidence!: {code:string, value: string};
  hpoFrequency!: string;
  reference?: Reference[];
  _reference?: string[];
  validationStatus!: boolean;
  phenotype!: Phenotype;
  frequencyRank = 0;
  _evidence?: string;

  constructor(obj: Partial<PhenotypeAssociation> = {}) {
    Object.assign(this, obj);


    if(obj.phenotype) {
      this.phenotype = new Phenotype(obj.phenotype);
    }
    if(obj.hpoFrequency){
      this.frequencyRank = FREQUENCYRANK.indexOf(obj.hpoFrequency);
    }

    if(obj._reference){
      this.reference = obj._reference.map(ref => new Reference({code: ref}));
      delete this._reference;
    }

    if(obj._evidence){
      this.evidence = EVIDENCE.filter(e => e.code == obj._evidence)[0];
      delete this._evidence;
    }
  }
}

const FREQUENCYRANK = [
  "Excluded (0%)",
  "Very rare (<4-1%)",
  "Occasional (29-5%)",
  "Frequent (79-30%)",
  "Very frequent (99-80%)",
  "Obligate (100%)"
]

const EVIDENCE = [
  {code: 'TAS', value: 'Traceable Author Statement'},
  {code: 'IEA', value: 'Inferred from Electronic Annotation'},
  {code: 'PCS', value: 'Published Clinical Study'}
]

