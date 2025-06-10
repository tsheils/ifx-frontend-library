import {
  FilterCategory,
  OpenApiPath,
} from '@ncats-frontend-library/models/utils';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Analyte,
  Classes,
  CommonAnalyte,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  RampChemicalEnrichmentResponse,
  RampOntologyEnrichmentResponse,
  RampPathwayEnrichmentResponse,
  RampReactionClassEnrichmentResponse,
  RampResponse,
  Reaction,
  ReactionClass,
  SourceVersion,
  Stats,
} from 'ramp';

export const LoadRampActions = createActionGroup({
  source: 'Load Ramp',
  events: {
    loadRamp: emptyProps(),
    loadRampSuccess: props<{
      supportedIds: { analyteType: string; idTypes: string[] }[];
    }>(),
    loadRampFailure: props<{ error: string }>(),
    loadRampApi: props<{ url: string }>(),
    loadRampApiSuccess: props<{ api: Map<string, OpenApiPath[]> }>(),
    loadRampApiFailure: props<{ error: string }>(),
    loadRampStats: emptyProps(),
    loadRampStatsSuccess: props<{ data: Stats }>(),
    loadRampStatsFailure: props<{ error: string }>(),
    loadSourceVersions: emptyProps(),
    loadSourceVersionsSuccess: props<{ versions: SourceVersion[] }>(),
    loadSourceVersionsFailure: props<{ error: string }>(),
  },
});

export const PathwayFromAnalyteActions = createActionGroup({
  source: 'Pathways from Analytes',
  events: {
    fetchPathwaysFromAnalytes: props<{
      analytes: string[];
      background?: string;
      backgroundFile?: File;
      pValType?: string;
      pValCutoff?: number;
      percAnalyteOverlap?: number;
      minPathwayToCluster?: number;
      percPathwayOverlap?: number;
    }>(),
    fetchPathwaysFromAnalytesSuccess: props<RampResponse<Pathway>>(),
    fetchPathwaysFromAnalytesFailure: props<{ error: string }>(),
  },
});

export const AnalyteFromPathwayActions = createActionGroup({
  source: 'Analytes from Pathways',
  events: {
    fetchAnalytesFromPathways: props<{
      pathways: string[];
      analyteType: string;
    }>(),
    fetchAnalytesFromPathwaysSuccess: props<RampResponse<Analyte>>(),
    fetchAnalytesFromPathwaysFailure: props<{ error: string }>(),
  },
});

export const OntologyFromMetaboliteActions = createActionGroup({
  source: 'Ontologies from Metabolites',
  events: {
    fetchOntologiesFromMetabolites: props<{ metabolites: string[] }>(),
    fetchOntologiesFromMetabolitesSuccess: props<RampResponse<Ontology>>(),
    fetchOntologiesFromMetabolitesFailure: props<{ error: string }>(),
  },
});

export const MetaboliteFromOntologyActions = createActionGroup({
  source: 'Metabolite from Ontologies',
  events: {
    fetchOntologies: emptyProps(),
    fetchOntologiesSuccess: props<{
      data: FilterCategory[];
    }>(),
    fetchOntologiesFailure: props<{ error: string }>(),
    fetchMetabolitesFromOntologies: props<{ ontologies: string[] }>(),
    fetchMetabolitesFromOntologiesFile: props<{
      ontologies: string[];
      format: string;
    }>(),
    fetchMetabolitesFromOntologiesSuccess: props<RampResponse<Metabolite>>(),
    fetchMetaboliteFromOntologiesFailure: props<{ error: string }>(),
  },
});

export const OntologyEnrichmentsActions = createActionGroup({
  source: 'Ontology Enrichment',
  events: {
    fetchOntologyEnrichment: props<{
      metabolites: string[];
      background?: string;
      backgroundFile?: File;
    }>(),
    fetchOntologyEnrichmentFile: emptyProps(),
    fetchOntologyEnrichmentSuccess: props<{
      data: RampOntologyEnrichmentResponse;
      // pValType?: string;
      //  pValCutoff?: number;
    }>(),
    fetchOntologyEnrichmentFailure: props<{ error: string }>(),
    filterOntologyEnrichment: props<{
      pValType: string;
      pValCutoff: number;
    }>(),
    filterOntologyEnrichmentSuccess: props<{
      data: RampOntologyEnrichmentResponse;
    }>(),
    filterOntologyEnrichmentFailure: props<{ error: string }>(),
  },
});

export const ClassesFromMetabolitesActions = createActionGroup({
  source: 'Classes From Metabolites',
  events: {
    fetchClassesFromMetabolites: props<{
      metabolites: string[];
      background?: string;
      backgroundFile?: File;
    }>(),
    fetchClassesFromMetabolitesSuccess: props<RampResponse<Classes>>(),
    fetchClassesFromMetabolitesFailure: props<{ error: string }>(),
  },
});

export const PropertiesFromMetaboliteActions = createActionGroup({
  source: 'Properties from Metabolites',
  events: {
    fetchPropertiesFromMetabolites: props<{ metabolites: string[] }>(),
    fetchPropertiesFromMetabolitesSuccess: props<RampResponse<Properties>>(),
    fetchPropertiesFromMetabolitesFailure: props<{ error: string }>(),
  },
});

export const CommonReactionAnalyteActions = createActionGroup({
  source: 'Common Reaction Analytes',
  events: {
    fetchCommonReactionAnalytes: props<{ analytes: string[] }>(),
    fetchCommonReactionAnalytesSuccess: props<RampResponse<CommonAnalyte>>(),
    fetchCommonReactionAnalytesFailure: props<{ error: string }>(),
  },
});

export const ReactionsFromAnalytesActions = createActionGroup({
  source: 'Reactions From Analytes',
  events: {
    fetchReactionsFromAnalytes: props<{
      analytes: string[];
      onlyHumanMets?: boolean;
      humanProtein?: boolean;
      includeTransportRxns?: boolean;
      rxnDirs?: string;
      includeRxnURLs?: boolean;
    }>(),
    fetchReactionsFromAnalytesSuccess: props<RampResponse<Reaction>>(),
    fetchReactionsFromAnalytesFailure: props<{ error: string }>(),
  },
});

export const ReactionClassesFromAnalytesActions = createActionGroup({
  source: 'Reaction Classes from Analytes',
  events: {
    fetchReactionClassesFromAnalytes: props<{
      analytes: string[];
      multiRxnParticipantCount?: number;
      humanProtein?: boolean;
      concatResults?: boolean;
      includeReactionIDs?: string;
      useIdMapping?: boolean;
    }>(),
    fetchReactionClassesFromAnalyteSuccess:
      props<RampResponse<ReactionClass>>(),
    fetchReactionClassesFromAnalyteFailure: props<{ error: string }>(),
  },
});

export const ReactionClassEnrichmentsActions = createActionGroup({
  source: 'Reaction Class Enrichment',
  events: {
    fetchReactionClassEnrichment: props<{
      analytes: string[];
      background?: string;
      backgroundFile?: File;
    }>(),
    fetchReactionClassEnrichmentFile: emptyProps(),
    fetchReactionClassEnrichmentSuccess: props<{
      data: RampReactionClassEnrichmentResponse;
      pValType?: string;
      pValCutoff?: number;
    }>(),
    fetchReactionClassEnrichmentFailure: props<{ error: string }>(),
    filterReactionClassEnrichment: props<{
      pValType: string;
      pValCutoff: number;
    }>(),
    filterReactionClassEnrichmentSuccess: props<{
      data: RampReactionClassEnrichmentResponse;
    }>(),
    filterReactionClassEnrichmentFailure: props<{ error: string }>(),
  },
});

export const PathwayEnrichmentsActions = createActionGroup({
  source: 'Pathway Enrichment',
  events: {
    fetchPathwaysFromAnalytes: props<{
      analytes: string[];
      background?: string;
      backgroundFile?: File;
      pValType?: string;
      pValCutoff?: number;
      percAnalyteOverlap?: number;
      minPathwayToCluster?: number;
      percPathwayOverlap?: number;
    }>(),
    fetchPathwaysFromAnalytesSuccess: props<RampResponse<Pathway>>(),
    fetchPathwaysFromAnalytesFailure: props<{ error: string }>(),
    fetchEnrichmentFromPathways: props<{
      analytes: string[];
      background?: string;
      backgroundFile?: File;
      pValType?: string;
      pValCutoff?: number;
      percAnalyteOverlap?: number;
      minPathwayToCluster?: number;
      percPathwayOverlap?: number;
    }>(),
    fetchEnrichmentFromPathwaysSuccess: props<RampPathwayEnrichmentResponse>(),
    fetchEnrichmentFromPathwaysFailure: props<{ error: string }>(),
    filterEnrichmentFromPathways: props<{
      pValType: string;
      pValCutoff: number;
      percAnalyteOverlap?: number;
      minPathwayToCluster?: number;
      percPathwayOverlap?: number;
    }>(),
    filterEnrichmentFromPathwaysSuccess: props<RampPathwayEnrichmentResponse>(),
    filterEnrichmentFromPathwaysFailure: props<{ error: string }>(),
    fetchClusterFromEnrichment: props<{
      percAnalyteOverlap: number;
      minPathwayToCluster: number;
      percPathwayOverlap: number;
    }>(),
    fetchClusterFromEnrichmentSuccess: props<RampPathwayEnrichmentResponse>(),
    fetchClusterFromEnrichmentFailure: props<{ error: string }>(),
    fetchClusterImageFile: props<{
      percAnalyteOverlap: number;
      minPathwayToCluster: number;
      percPathwayOverlap: number;
    }>(),
  },
});

export const MetaboliteEnrichmentsActions = createActionGroup({
  source: 'Metabolite Enrichment',
  events: {
    fetchClassesFromMetabolites: props<{
      metabolites: string[];
      background?: string;
      backgroundFile?: File;
    }>(),
    fetchClassesFromMetabolitesSuccess: props<RampResponse<Classes>>(),
    fetchClassesFromMetabolitesFailure: props<{ error: string }>(),
    fetchEnrichmentFromMetabolites: props<{
      metabolites: string[];
      background?: string;
      backgroundFile?: File;
    }>(),
    fetchEnrichmentFromMetabolitesFile: emptyProps(),
    fetchEnrichmentFromMetabolitesSuccess: props<{
      data: RampChemicalEnrichmentResponse;
      pValType?: string;
      pValCutoff?: number;
    }>(),
    fetchEnrichmentFromMetabolitesFailure: props<{ error: string }>(),
    filterEnrichmentFromMetabolites: props<{
      pValType: string;
      pValCutoff: number;
    }>(),
    filterEnrichmentFromMetabolitesSuccess: props<{
      data: RampChemicalEnrichmentResponse;
    }>(),
    filterEnrichmentFromMetabolitesFailure: props<{ error: string }>(),
  },
});

export const IdentifierHarmonizationActions = createActionGroup({
  source: 'Harmonize Identifiers',
  events: {
    runIdentifierHarmonization: props<{ files: File[]; manifest: File }>(),
    runIdentifierHarmonizationSuccess: emptyProps(),
    runIdentifierHarmonizationFailure: props<{ error: string }>(),
  },
});
