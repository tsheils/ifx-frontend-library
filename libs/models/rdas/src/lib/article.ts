import {Author} from "./author";
import {Disease} from "./disease";

export class Article {
  abstractText!: string;
  affiliation!: string;
  appearsInJournalVolumes?: any[]; //[JournalVolume!]
  authorsWrote?: Author[]; //[Author!]!
  citedByCount!: number;
  diseasesMentionedIn!: Disease[];
  doi!: string;
  firstPublicationDate!: string;
  fullTextUrlsContentFor?: any[]; //[FullTextUrl!]!
  hasOmimRefomimRefs?: any[]; //[OMIMRef!]!
  hasPDF!: string;
  inEPMC!: string;
  inPMC!: string;
  isEpi?: string;
  isOpenAccess!: string;
  keywordsKeywordFor?: any[]; //[Keyword!]!
  meshTermsMeshTermFor?: any[]; //[MeshTerm!]!
  omim_evidence?: boolean;
  pubType?: string[];
  pubmed_evidence?: boolean;
  pubmed_id!: string;
  pubtatorAnnotationsAnnotationFor?: any[]; // [PubtatorAnnotation!]
  refInOMIM?: boolean;
  source!: string;
  substancesSubstanceAnnotatedByPubmed?: any[]; //[Substance!]!
  title!: string;

  constructor(obj: any) {
    Object.assign(this, obj);

    if(obj.authorsWrote) {
      this.authorsWrote = obj.authorsWrote.map((author: never) => new Author(author));
    }
  }
}

export const ARTICLEVARIABLES: any = {
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
export const ARTICLEFIELDS = gql`
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
