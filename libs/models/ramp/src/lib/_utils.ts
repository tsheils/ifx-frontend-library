import {
  DataMap,
  DataProperty,
  QueryResultsData,
  VisualizationMap,
} from '@ncats-frontend-library/models/utils';
import { QuestionBase } from 'ncats-form-question';
import { ChemicalEnrichment } from './chemical-enrichment';
import { FisherResult, FishersDataframe } from './fisher-result';
import { RampQuery } from './ramp-query';
import { Reaction } from './reaction';

export class RampDataGeneric {
  id!: string;
}

export class RampPage {
  inputMap?: FormSubsection[];
  overviewMap?: QueryResultsData;
  visualizationsMap?: Map<string, VisualizationMap[]>;
  dataMap?: Map<string, DataMap>;
}

export interface RampAPIResponse<T extends RampDataGeneric> {
  data: Array<T>;
  function_call: string[];
  numFoundIds?: number[];
}

export interface RampReactionAPIResponse {
  data: {
    met2rxn: Reaction[];
    prot2rxn: Reaction[];
    metProteinCommonReactions: Reaction[];
  };
  function_call: string[];
  numFoundIds?: number[];
  plot: { [key: string]: string[] };
}

export interface RampResponse<T extends RampDataGeneric> {
  data: Array<T>;
  query?: RampQuery;
  // dataframe?: unknown[];
  dataAsDataProperty?: { [p: string]: DataProperty }[];
  plot?: { id: string; sets: string[]; size: number }[];
  background?: string;
  backgroundFile?: File;
  pValType?: string;
  pValCutoff?: number;
  percAnalyteOverlap?: number;
  minPathwayToCluster?: number;
  percPathwayOverlap?: number;
}

export interface RampPathwayEnrichmentAPIResponse {
  data: {
    analyteType: string[];
    cluster_list?: { [key: string]: string[] };
    fishresults: FisherResult[];
    pathway_matrix?: { [key: string]: string }[];
    result_type?: string[];
  };
  function_call?: string[];
}

export interface RampPathwayEnrichmentResponse
  extends RampResponse<FisherResult> {
  clusterImage?: string;
  filteredFishersDataframe?: FishersDataframe;
  combinedFishersDataframe?: FishersDataframe;
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
  data: {
    ClassyFire_class?: ChemicalEnrichment[];
    ClassyFire_sub_class?: ChemicalEnrichment[];
    ClassyFire_super_class?: ChemicalEnrichment[];
    result_type?: string[];
  };
  enriched_chemical_class_list: ChemicalEnrichment[];
  query?: RampQuery;
  dataAsDataProperty?: { [p: string]: DataProperty }[];
}

export class FormSubsection {
  section!: string;
  questions!: QuestionBase<string>[];
}
