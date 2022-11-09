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

export const ARTICLEVARIABLES: {
  diseasesWhere?: { gard_id?: null | string },
  mentionedInEpiArticlesOptions?: {
    limit?: number,
    sort?: [{ firstPublicationDate?: string }]
  },
  mentionedInEpiArticlesWhere?: { isEpi?: string },
  meshTermsMeshTermForEpiOptions?: {limit?: number},
  mentionedInNonEpiArticlesOptions?: {
    limit?: number,
    sort?: [{ firstPublicationDate?: string }]
  },
  mentionedInNonEpiArticlesWhere?: { isEpi?: null | string },
  meshTermsMeshTermForNonEpiOptions?: {limit: number}
} = {
  diseasesWhere: {
    gard_id: null
  },
  mentionedInEpiArticlesOptions: {
    limit: 10,
    sort: [
      {
        firstPublicationDate: "DESC"
      }
    ]
  },
  mentionedInEpiArticlesWhere: {
    isEpi: "Y"
  },
  meshTermsMeshTermForEpiOptions: {limit: 10},
  mentionedInNonEpiArticlesOptions: {
    limit: 10,
    sort: [
      {
        firstPublicationDate: "DESC"
      }
    ]
  },
  mentionedInNonEpiArticlesWhere: {
    isEpi: null
  },
  meshTermsMeshTermForNonEpiOptions: {limit: 10}
}


export const ARTICLEFIELDS = `
  fragment articleFields on Article {
    abstractText
    firstPublicationDate
    hasPDF
    inEPMC
    inPMC
    isEpi
    isOpenAccess
    omim_evidence
    pubType
    pubmed_evidence
    pubmed_id
    refInOMIM
    source
    title
    doi
    citedByCount
    affiliation
  }
`;
