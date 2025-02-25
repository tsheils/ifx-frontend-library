import { RampDataGeneric } from './_utils';

export class Ontology extends RampDataGeneric {
  HMDBOntologyType!: string;
  idType?: string;
  metabolites?: string;
  ontology!: string;
  sourceId!: string;
  commonName?: string;
  rampOntologyId?: string;
  metCount!: number;
  value?: string;
  source?: string;

  constructor(obj: { [key: string]: unknown }) {
    super();
    if (obj['HMDBOntologyType']) {
      this.HMDBOntologyType = <string>obj['HMDBOntologyType'];
      this.source = <string>obj['HMDBOntologyType'];
    }
    if (obj['IDtype']) {
      this.idType = <string>obj['IDtype'];
    }
    if (obj['Metabolites']) {
      this.metabolites = <string>obj['Metabolites'];
    }
    if (obj['Ontology']) {
      this.ontology = <string>obj['Ontology'];
      this.value = <string>obj['Ontology'];
    }
    if (obj['sourceId']) {
      this.id = <string>obj['sourceId'];
      this.sourceId = <string>obj['sourceId'];
    }
    if (obj['commonName']) {
      this.ontology = <string>obj['commonName'];
      this.value = <string>obj['commonName'];
    }
    if (obj['rampOntologyId']) {
      this.rampOntologyId = <string>obj['rampOntologyId'];
    }

    if (obj['metCount']) {
      this.metCount = <number>obj['metCount'];
    }
  }
}

export class OntologyEnrichment extends RampDataGeneric {
  ontology!: string;
  HMDBOntologyType!: string;
  Pval?: number;
  OR?: number;
  Num_In_Ontology?: number;
  Total_In_Ontology?: number;
  Pval_FDR?: number;
  Pval_Holm?: number;
  analytes?: string;
  source!: string;
  ontologyAverage!: string;

  constructor(obj: { [key: string]: unknown }) {
    super();
    Object.assign(this, obj);
    if (obj['HMDBOntologyType']) {
      this.HMDBOntologyType = <string>obj['HMDBOntologyType'];
      this.source = <string>obj['HMDBOntologyType'];
    }

    if (obj['Ontology']) {
      this.ontology = <string>obj['Ontology'];
    }

    if (obj['analytes']) {
      const analyteString = <string>obj['analytes'];
      this.analytes = analyteString.replaceAll('|', ' | ');
    }

    if (obj['Num_In_Ontology'] && obj['Total_In_Ontology']) {
      this.ontologyAverage =
        this.Num_In_Ontology + '/' + this.Total_In_Ontology;
    }
  }
}
