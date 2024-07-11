import { ChemicalEnrichment } from './chemical-enrichment';
import { FisherResult, FishersDataframe } from './fisher-result';
import { RampQuery } from './ramp-query';

export class RampDataGeneric {}

export class RampResults {
  function?: string;
  matches?: string[];
  noMatches?: string[];
  count?: number;
  inputLength?: number;
  inputType?: string;
  fuzzy?: boolean;
}

export interface RampAPIResponse<T extends RampDataGeneric> {
  data: Array<T>;
  function_call: string[];
  numFoundIds: number[];
}

export interface RampResponse<T extends RampDataGeneric> {
  data: Array<T>;
  query: RampQuery;
  dataframe?: unknown[];
  biospecimen?: string;
  background?: File;
  pval_type?: string;
  pval_cutoff?: number;
  perc_analyte_overlap?: number;
  min_pathway_tocluster?: number;
  perc_pathway_overlap?: number;

}

export interface RampPathwayEnrichmentAPIResponse {
  data: {
    analyte_type: string[];
    cluster_list?: { [key: string]: string[] };
    fishresults: FisherResult[];
    pathway_matrix?: { [key: string]: string }[];
    result_type?: string[];
  };
  function_call?: string[];
}

export interface RampPathwayEnrichmentResponse {
  data: FisherResult[];
  query: RampQuery;
  filteredFishersDataframe?: FishersDataframe;
  combinedFishersDataframe?: FishersDataframe;
  biospecimen?: string;
  background?: File;
  pval_type?: string;
  pval_cutoff?: number;
  perc_analyte_overlap?: number;
  min_pathway_tocluster?: number;
  perc_pathway_overlap?: number;
}

export interface RampChemicalEnrichmentAPIResponse {
  data: {
    ClassyFire_class?: ChemicalEnrichment[];
    ClassyFire_sub_class?: ChemicalEnrichment[];
    ClassyFire_super_class?: ChemicalEnrichment[];
    result_type?: string[];
  };
  function_call?: string[];
}

export interface RampChemicalEnrichmentResponse {
  //  data: ChemicalEnrichment[];
  data: {
    ClassyFire_class?: ChemicalEnrichment[];
    ClassyFire_sub_class?: ChemicalEnrichment[];
    ClassyFire_super_class?: ChemicalEnrichment[];
    result_type?: string[];
  };
  enriched_chemical_class_list: ChemicalEnrichment[];
  query?: RampQuery;
  openModal?: boolean;
}
