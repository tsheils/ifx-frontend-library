import { RampDataGeneric } from './_utils';

export class Pathway extends RampDataGeneric {
  pathwayName!: string;
  pathwaySource!: string;
  pathwayId!: string;
  pathwayType!: string;
  analyteName?: string;
  commonName?: string;
  inputId!: string;

  constructor(obj: Partial<Pathway>) {
    super();
    Object.assign(this, obj);
  }
}
