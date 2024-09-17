
export class Reaction {
  reactionId!: string;
  label?: string;
  equation?: string;
  isTransport?: boolean;
  hasHumanProtein?: boolean;
  onlyHumanMets?: boolean;

  metHitCount = 0;
  metSourceId!: string;
  metName?: string;
  substrateProductFlag?: number;
  isCofactor?: boolean;
  htmlEquation?: string;
  direction?: string;

  /*
  uniprot: uniprot:P00568,
  proteinName: AK1,
  ecNumber: 2.7.4.6,

  metabolites: chebi:456215,
  metNames: AMP,
  uniprot: uniprot:P00568,
  proteinName: AK1,
*/

  constructor(obj: Partial<Reaction>) {
    Object.assign(this, obj);
  }
}

export class ReactionClass {
  classLevel!: number;
  ecNumber!: string;
  metCount!: number;
  proteinCount!: number;
  reactionCount!: number;
  rxnClass!: string;
  rxnClassHierarcy!: string;
  hierarchyArray!: string[];
  totalMetsInRxnClass!: number;
  totalProteinsInRxnClass!: number;
  totalRxnsInClass!: number;
  metCountAverage?: string;
  proteinCountAverage?: string;
  totalReactionAverage?: string;

  constructor(obj: Partial<ReactionClass>) {
    Object.assign(this, obj);

    if (obj['rxnClassHierarcy']) {
      const hierarchy = <string>obj['rxnClassHierarcy'];
      this.hierarchyArray = hierarchy.split(' | ') as string[];
    }
    if (obj['metCount'] && obj['totalMetsInRxnClass']) {
      this.metCountAverage = `${obj['metCount']?.toString()}/${obj['totalMetsInRxnClass']?.toString()}`;
    }

    if (obj['proteinCount'] && obj['totalProteinsInRxnClass']) {
      this.proteinCountAverage = `${obj['proteinCount']?.toString()}/${obj['totalProteinsInRxnClass']?.toString()}`;
    }

    if (obj['reactionCount'] && obj['totalRxnsInClass']) {
      this.totalReactionAverage = `${obj['reactionCount']?.toString()}/${obj['totalRxnsInClass']?.toString()}`;
    }
  }
}

export class CommonAnalyte {
  inputAnalyte!: string;
  inputCommonNames!: string;
  rxnPartnerCommonName!: string;
  rxnPartnerIds!: string[];
  rxnPartnerIdsString!: string;
  queryRelation!: string;

  constructor(obj: { [key: string]: unknown }) {
    if (obj['input_analyte']) {
      this.inputAnalyte = <string>obj['input_analyte'];
    }

    if (obj['query_relation']) {
      this.queryRelation = <string>obj['query_relation'];
    }

    if (obj['input_common_names']) {
      this.inputCommonNames = <string>obj['input_common_names'];
    }

    if (obj['rxn_partner_common_name']) {
      this.rxnPartnerCommonName = <string>obj['rxn_partner_common_name'];
    }

    if (obj['rxn_partner_ids']) {
      this.rxnPartnerIdsString = (<string>obj['rxn_partner_ids']).replace(
        /,/g,
        ', ',
      );
      this.rxnPartnerIds = this.rxnPartnerIdsString.split(',');
    }
  }
}
