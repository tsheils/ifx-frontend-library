import { RampDataGeneric } from './_utils';

export class ChemicalEnrichment extends RampDataGeneric {
  category!: string;
  class_name!: string;
  met_hits!: number;
  met_size!: number;
  pVal!: number;
  pVal_FDR!: number;
  pVal_Holm!: number;
  pop_hits!: number;
  pop_size!: number;

  constructor(obj: { [key: string]: unknown }) {
    super();
    if (obj['category']) {
      this.id = <string>obj['category'];
      this.category = <string>obj['category'];
    }
    if (obj['class_name']) {
      this.class_name = <string>obj['class_name'];
    }
    if (obj['met_hits']) {
      this.met_hits = <number>obj['met_hits'];
    }
    if (obj['met_size']) {
      this.met_size = <number>obj['met_size'];
    }
    if (obj['Pval']) {
      this.pVal = <number>obj['Pval'];
    }
    if (obj['Pval_FDR']) {
      this.pVal_FDR = <number>obj['Pval_FDR'];
    }
    if (obj['Pval_Holm']) {
      this.pVal_Holm = <number>obj['Pval_Holm'];
    }
    if (obj['pop_hits']) {
      this.pop_hits = <number>obj['pop_hits'];
    }
    if (obj['pop_size']) {
      this.pop_size = <number>obj['pop_size'];
    }
  }
}
