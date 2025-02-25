import { RampDataGeneric } from './_utils';

export class Metabolite extends RampDataGeneric {
  ontologyCategory!: string;
  metIds!: string;
  metNames!: string;
  ontologyTerm!: string;

  constructor(obj: Partial<Metabolite>) {
    super();
    Object.assign(this, obj);

    this.id = this.ontologyTerm;
    if (obj['metIds']) {
      this.metIds = (<string>obj['metIds']).replace(/,/g, ', ');
    }
  }
}
