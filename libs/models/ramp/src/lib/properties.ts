import { RampDataGeneric } from './_utils';

export class Properties extends RampDataGeneric {
  chem_source_id!: string;
  iso_smiles!: string;
  inchi_key_prefix!: string;
  inchi_key!: string;
  inchi!: string;
  mw!: string;
  monoisotop_mass!: string;
  common_name!: string;
  mol_formula!: string;
  imageUrl!: string;

  constructor(obj: Partial<Properties>) {
    super();
    Object.assign(this, obj);
    this.id = this.chem_source_id;
    this.imageUrl = this.iso_smiles;
  }
}
