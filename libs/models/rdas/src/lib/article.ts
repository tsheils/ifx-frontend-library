import {Author} from "./author";
import {Disease} from "./disease";

export class Article {
  abstractText!: string;
  affiliation!: string;
 // appearsInJournalVolumes?: []; //[JournalVolume!]
  authorsWrote?: Author[]; //[Author!]!
  citedByCount!: number;
  diseasesMentionedIn!: Disease[];
  doi!: string;
  firstPublicationDate!: string;
//  fullTextUrlsContentFor?: any[]; //[FullTextUrl!]!
 // hasOmimRefomimRefs?: any[]; //[OMIMRef!]!
  hasPDF!: string;
  inEPMC!: string;
  inPMC!: string;
  isEpi?: string;
  isOpenAccess!: string;
//  keywordsKeywordFor?: any[]; //[Keyword!]!
 // meshTermsMeshTermFor?: any[]; //[MeshTerm!]!
  omim_evidence?: boolean;
  pubType?: string[];
  pubmed_evidence?: boolean;
  pubmed_id!: string;
 // pubtatorAnnotationsAnnotationFor?: any[]; // [PubtatorAnnotation!]
  refInOMIM?: boolean;
  source!: string;
  substancesSubstanceAnnotatedByPubmed?: unknown[]; //[Substance!]!
  title!: string;

  constructor(obj: Partial<Article> = {}) {
    Object.assign(this, obj);

    if(obj.authorsWrote) {
      this.authorsWrote = obj.authorsWrote.map((author: Partial<Author> = {}) => new Author(author));
    }
  }
}




