export class EntityCount {
  status_category!: string;
  total= 0;
  hmdb = 0;
  lipidmaps = 0;
  reactome = 0;
  wiki = 0;
  chebi = 0;
  kegg= 0;
  pfocr= 0;
  refmet= 0;
  rhea= 0;

  constructor(obj: { [key: string]: string | number }) {
    if (obj['status_category']) {
      this.status_category = <string>obj['status_category'];
    }
    if (obj['HMDB']) {
      this.hmdb = parseInt(<string>obj['HMDB']);
      this.total = this.total + this.hmdb;
    }
    if (obj['LIPIDMAPS']) {
      this.lipidmaps = parseInt(<string>obj['LIPIDMAPS']);
      this.total = this.total + this.lipidmaps;
    }
    if (obj['Reactome']) {
      this.reactome = parseInt(<string>obj['Reactome']);
      this.total = this.total + this.reactome;
    }
    if (obj['WikiPathways']) {
      this.wiki = parseInt(<string>obj['WikiPathways']);
      this.total = this.total + this.wiki;
    }
    if (obj['ChEBI']) {
      this.chebi = parseInt(<string>obj['ChEBI']);
      this.total = this.total + this.chebi;
    }
    if (obj['KEGG']) {
      this.kegg = parseInt(<string>obj['KEGG']);
      this.total = this.total + this.kegg;
    }
    if (obj['Rhea']) {
      this.rhea = parseInt(<string>obj['Rhea']);
      this.total = this.total + this.rhea;
    }

    if (obj['RefMet']) {
      this.refmet = parseInt(<string>obj['RefMet']);
      this.total = this.total + this.refmet;
    }

    if (obj['PFOCR']) {
      this.pfocr = parseInt(<string>obj['PFOCR']);
      this.total = this.total + this.pfocr;
    }

  }
}
