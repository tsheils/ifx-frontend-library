import {
  FilterCategory,
  OpenApiPath,
} from '@ncats-frontend-library/models/utils';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import {
  Analyte,
  Classes,
  EntityCount,
  FishersDataframe,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  RampResponse,
  Reaction,
  SourceVersion,
  RampChemicalEnrichmentResponse,
  CommonAnalyte,
  ReactionClass,
  RampPathwayEnrichmentResponse,
  RampReactionClassEnrichmentResponse,
  RampOntologyEnrichmentResponse,
} from 'ramp';

import {
  AnalyteFromPathwayActions,
  ClassesFromMetabolitesActions,
  CommonReactionAnalyteActions,
  LoadRampActions,
  MetaboliteEnrichmentsActions,
  MetaboliteFromOntologyActions,
  OntologyEnrichmentsActions,
  OntologyFromMetaboliteActions,
  PathwayEnrichmentsActions,
  PathwayFromAnalyteActions,
  PropertiesFromMetaboliteActions,
  ReactionClassEnrichmentsActions,
  ReactionClassesFromAnalytesActions,
  ReactionsFromAnalytesActions,
} from './ramp.actions';

export const RAMP_STORE_FEATURE_KEY = 'rampStore';

export interface RampEntity {
  loading: false;
}

export interface State extends EntityState<RampEntity> {
  selectedId?: string | number; // which RampStore record has been selected
  loading: boolean; // has the RampStore list been loaded
  error?: string | null; // last known error (if any)
  supportedIds?: { analyteType: string; idTypes: string[] }[];
  sourceVersions: SourceVersion[];
  entityCounts: EntityCount[];
  metaboliteIntersects: { id: string; sets: string[]; size: number }[];
  geneIntersects: { id: string; sets: string[]; size: number }[];
  databaseUrl?: string;

  pathwayEnrichments?: RampPathwayEnrichmentResponse;
  filteredFishersDataframe?: FishersDataframe;
  combinedFishersDataframe?: FishersDataframe;
  analytes?: RampResponse<Analyte>;
  pathways?: RampResponse<Pathway>;
  clusterPlot?: string;

  commonReactions?: RampResponse<CommonAnalyte>;
  reactions?: RampResponse<Reaction>;
  reactionClasses?: RampResponse<ReactionClass>;

  metabolitesFromOntologies?: RampResponse<Metabolite>;
  ontologiesList?: FilterCategory[];
  ontologies?: RampResponse<Ontology>;
  ontologyEnrichments?: RampOntologyEnrichmentResponse;
  metClasses?: RampResponse<Classes>;
  properties?: RampResponse<Properties>;
  chemicalEnrichments?: RampChemicalEnrichmentResponse;
  reactionClassEnrichments?: RampReactionClassEnrichmentResponse;

  api?: Map<string, OpenApiPath[]>;
}

export interface RampPartialState {
  readonly [RAMP_STORE_FEATURE_KEY]: State;
}

export const rampAdapter: EntityAdapter<RampEntity> =
  createEntityAdapter<RampEntity>();

export const initialState: State = rampAdapter.getInitialState({
  // set initial required properties
  loading: false,
  entityCounts: [],
  sourceVersions: [],
  ontologiesList: [],
  geneIntersects: [] as { id: string; sets: string[]; size: number }[],
  metaboliteIntersects: [] as { id: string; sets: string[]; size: number }[],
});

export const rampReducer = createReducer(
  initialState,

  on(LoadRampActions.loadRamp, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(LoadRampActions.loadRampStats, (state) => ({
    ...state,
    error: null,
  })),

  on(
    OntologyFromMetaboliteActions.fetchOntologiesFromMetabolites,
    AnalyteFromPathwayActions.fetchAnalytesFromPathways,
    PathwayEnrichmentsActions.fetchPathwaysFromAnalytes,
    PathwayFromAnalyteActions.fetchPathwaysFromAnalytes,
    MetaboliteFromOntologyActions.fetchMetabolitesFromOntologies,
    OntologyEnrichmentsActions.fetchOntologyEnrichment,
    CommonReactionAnalyteActions.fetchCommonReactionAnalytes,
    ReactionsFromAnalytesActions.fetchReactionsFromAnalytes,
    ReactionClassesFromAnalytesActions.fetchReactionClassesFromAnalytes,
    ReactionClassEnrichmentsActions.fetchReactionClassEnrichment,
    ReactionClassEnrichmentsActions.filterReactionClassEnrichment,
    ClassesFromMetabolitesActions.fetchClassesFromMetabolites,
    PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolites,
    MetaboliteEnrichmentsActions.fetchClassesFromMetabolites,
    MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolites,
    PathwayEnrichmentsActions.fetchEnrichmentFromPathways,
    (state) => ({
      ...state,
      loading: true,
      error: null,
    })
  ),

  on(LoadRampActions.loadRampStatsSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    sourceVersions: data.sourceVersions,
    entityCounts: data.entityCounts,
    metaboliteIntersects: data.metaboliteIntersects,
    geneIntersects: data.geneIntersects,
    databaseUrl: data.databaseUrl,
  })),

  /*

  on(LoadRampActions.loadRampSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    supportedIds: data,
  })),
*/

  on(LoadRampActions.loadRampSuccess, (state, { supportedIds }) => ({
    ...state,
    loading: false,
    supportedIds: supportedIds,
  })),

  on(LoadRampActions.loadSourceVersionsSuccess, (state, { versions }) => ({
    ...state,
    loading: false,
    sourceVersions: versions,
  })),

  on(LoadRampActions.loadRampApiSuccess, (state, { api }) => ({
    ...state,
    loading: false,
    api: api,
  })),

  on(
    OntologyFromMetaboliteActions.fetchOntologiesFromMetabolitesSuccess,
    (state, { data, query, dataAsDataProperty }) => ({
      ...state,
      loading: false,
      ontologies: { data, query, dataAsDataProperty },
    })
  ),

  on(
    AnalyteFromPathwayActions.fetchAnalytesFromPathwaysSuccess,
    (state, { data, query, dataAsDataProperty }) => ({
      ...state,
      loading: false,
      analytes: { data, query, dataAsDataProperty },
    })
  ),

  on(
    PathwayEnrichmentsActions.fetchPathwaysFromAnalytesSuccess,
    PathwayFromAnalyteActions.fetchPathwaysFromAnalytesSuccess,
    (state, { data, query, dataAsDataProperty }) => {
      return {
        ...state,
        loading: false,
        pathways: { data, query, dataAsDataProperty },
      };
    }
  ),

  on(
    CommonReactionAnalyteActions.fetchCommonReactionAnalytesSuccess,
    (state, { data, query, dataAsDataProperty }) => ({
      ...state,
      loading: false,
      commonReactions: { data, query, dataAsDataProperty },
    })
  ),

  on(
    ReactionsFromAnalytesActions.fetchReactionsFromAnalytesSuccess,
    (state, { data, query, dataAsDataProperty, plot }) => ({
      ...state,
      loading: false,
      reactions: { data, query, dataAsDataProperty, plot },
    })
  ),

  on(
    ReactionClassesFromAnalytesActions.fetchReactionClassesFromAnalyteSuccess,
    (state, { data, query, dataAsDataProperty }) => ({
      ...state,
      loading: false,
      reactionClasses: { data, query, dataAsDataProperty },
    })
  ),

  on(
    ReactionClassEnrichmentsActions.fetchReactionClassEnrichmentSuccess,
    ReactionClassEnrichmentsActions.filterReactionClassEnrichmentSuccess,
    (state, { data }) => {
      return {
        ...state,
        loading: false,
        reactionClassEnrichments: data,
      };
    }
  ),

  on(
    OntologyEnrichmentsActions.fetchOntologyEnrichmentSuccess,
    // OntologyEnrichmentsActions.filterOntologyEnrichmentSuccess,
    (state, { data }) => {
      return {
        ...state,
        loading: false,
        ontologyEnrichments: data,
      };
    }
  ),

  on(
    MetaboliteFromOntologyActions.fetchMetabolitesFromOntologiesSuccess,
    (state, { data, query, dataAsDataProperty }) => ({
      ...state,
      loading: false,
      metabolitesFromOntologies: { data, query, dataAsDataProperty },
    })
  ),

  on(
    MetaboliteFromOntologyActions.fetchOntologiesSuccess,
    (state, { data }) => ({
      ...state,
      loading: false,
      ontologiesList: data,
    })
  ),

  on(
    ClassesFromMetabolitesActions.fetchClassesFromMetabolitesSuccess,
    MetaboliteEnrichmentsActions.fetchClassesFromMetabolitesSuccess,
    (state, { data, query, dataAsDataProperty }) => ({
      ...state,
      loading: false,
      metClasses: { data, query, dataAsDataProperty },
    })
  ),

  on(
    PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolitesSuccess,
    (state, { data, query, dataAsDataProperty }) => ({
      ...state,
      loading: false,
      properties: { data, query, dataAsDataProperty },
    })
  ),

  on(
    MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesSuccess,
    MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesSuccess,
    (state, { data }) => {
      return {
        ...state,
        loading: false,
        chemicalEnrichments: data,
      };
    }
  ),

  on(
    PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysSuccess,
    (state, { data, query, combinedFishersDataframe, dataAsDataProperty }) => {
      return {
        ...state,
        loading: false,
        pathwayEnrichments: { data, query, dataAsDataProperty },
        combinedFishersDataframe: combinedFishersDataframe,
        filteredFishersDataframe: undefined,
        clusterPlot: '',
        dataAsDataProperty: dataAsDataProperty,
      };
    }
  ),

  on(
    PathwayEnrichmentsActions.filterEnrichmentFromPathwaysSuccess,
    (state, { data, query, filteredFishersDataframe, dataAsDataProperty }) => {
      return {
        ...state,
        loading: false,
        pathwayEnrichments: {
          data,
          query,
          dataAsDataProperty,
        },
        filteredFishersDataframe: filteredFishersDataframe,
        clusterPlot: '',
        dataAsDataProperty: dataAsDataProperty,
      };
    }
  ),

  on(
    PathwayEnrichmentsActions.fetchClusterFromEnrichmentSuccess,
    (state, { data, clusterImage, query, dataAsDataProperty }) => {
      return {
        ...state,
        loading: false,
        pathwayEnrichments: { data, query, dataAsDataProperty },
        clusterPlot: clusterImage,
      };
    }
  ),

  on(
    LoadRampActions.loadRampFailure,
    LoadRampActions.loadRampApiFailure,
    LoadRampActions.loadRampStatsFailure,
    LoadRampActions.loadSourceVersionsFailure,
    PathwayFromAnalyteActions.fetchPathwaysFromAnalytesFailure,
    OntologyFromMetaboliteActions.fetchOntologiesFromMetabolitesFailure,
    MetaboliteFromOntologyActions.fetchMetaboliteFromOntologiesFailure,
    MetaboliteFromOntologyActions.fetchOntologiesFailure,
    OntologyEnrichmentsActions.fetchOntologyEnrichmentFailure,
    CommonReactionAnalyteActions.fetchCommonReactionAnalytesFailure,
    ReactionsFromAnalytesActions.fetchReactionsFromAnalytesFailure,
    ReactionClassesFromAnalytesActions.fetchReactionClassesFromAnalyteFailure,
    ReactionClassEnrichmentsActions.fetchReactionClassEnrichmentFailure,
    ReactionClassEnrichmentsActions.filterReactionClassEnrichmentFailure,
    ClassesFromMetabolitesActions.fetchClassesFromMetabolitesFailure,
    PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolitesFailure,
    MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesFailure,
    MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesFailure,
    PathwayEnrichmentsActions.fetchPathwaysFromAnalytesFailure,
    PathwayEnrichmentsActions.fetchClusterFromEnrichmentFailure,
    PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysFailure,
    PathwayEnrichmentsActions.filterEnrichmentFromPathwaysFailure,
    (state, { error }) => {
      return {
        ...state,
        loading: false,
        error,
      };
    }
  )
);

export function reducer(state: State | undefined, action: Action) {
  return rampReducer(state, action);
}
