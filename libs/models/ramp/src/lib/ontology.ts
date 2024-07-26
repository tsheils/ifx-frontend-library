export class Ontology {
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
