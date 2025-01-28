export class Reference {
  code!: string
  url!: string

  constructor(obj: Partial<Reference> = {}) {
    Object.assign(this, obj)

    if (obj.code) {
      const split = obj.code.split(':')
      this.url = REFERENCELOOKUP.filter(
        (ref) => ref.origin == split[0]
      )[0].url.concat(split[1])
    }
  }

  _toString() {
    return this.code + ' | ' + this.url
  }
}

const REFERENCELOOKUP = [
  { origin: 'HPO', url: 'https://hpo.jax.org/app/browse/term/' },
  { origin: 'OMIM', url: 'https://www.omim.org/entry/' },
  {
    origin: 'ORPHA',
    url: 'https://www.orpha.net/consor/cgi-bin/OC_Exp.php?Expert=',
  },
  { origin: 'PMID', url: 'https://pubmed.ncbi.nlm.nih.gov/' },
]
