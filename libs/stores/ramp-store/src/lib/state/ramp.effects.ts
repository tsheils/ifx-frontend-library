import { inject } from '@angular/core';
import {
  FilterCategory,
  OpenApiPath,
} from '@ncats-frontend-library/models/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import {
  Analyte,
  Classes,
  CommonAnalyte,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  RampChemicalEnrichmentResponse,
  RampPathwayEnrichmentResponse,
  RampResponse,
  Reaction,
  ReactionClass,
  Stats,
} from 'ramp';
import {
  AnalyteFromPathwayActions,
  ClassesFromMetabolitesActions,
  CommonReactionAnalyteActions,
  LoadRampActions,
  MetaboliteEnrichmentsActions,
  MetaboliteFromOntologyActions,
  OntologyFromMetaboliteActions,
  PathwayEnrichmentsActions,
  PathwayFromAnalyteActions,
  PropertiesFromMetaboliteActions,
  ReactionClassesFromAnalytesActions,
  ReactionsFromAnalytesActions,
} from './ramp.actions';
import { RampService } from '../ramp.service';
import { exhaustMap, mergeMap, of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  getChemicalEnrichment,
  getClusterPlot,
  getCombinedFishersDataframe,
  // getEnrichedChemicalClass,
  getFilteredFishersDataframe,
} from './ramp.selectors';

export const init$ = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(LoadRampActions.loadRamp),
      exhaustMap(() => {
        return rampService.fetchSupportedIds().pipe(
          map(
            (ret: { analyteType: string; idTypes: string[] }[]) => {
              return LoadRampActions.loadRampSuccess({ supportedIds: ret });
            },
            catchError((error: ErrorEvent) =>
              of(LoadRampActions.loadRampFailure({ error: error.message })),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const loadApi$ = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(LoadRampActions.loadRampApi),
      exhaustMap((action) => {
        return rampService.fetchApi(action.url).pipe(
          map(
            (ret: {
              paths: { [key: string]: { post?: { [key: string]: unknown } } };
            }) => {
              const tempMap: Map<string, OpenApiPath[]> = new Map<
                string,
                OpenApiPath[]
              >();
              Object.entries(ret.paths).forEach(([key, value]) => {
                if (value.post && value.post['tags']) {
                  const parent = key.split('/api/')[1];
                  const tags: string[] = value.post['tags'] as string[];
                  tags.forEach((tag) => {
                    let tempArr: OpenApiPath[] = [];
                    if (tempMap.has(tag)) {
                      tempArr = tempMap.get(tag) as OpenApiPath[];
                      tempArr.push(
                        new OpenApiPath({ ...value.post, parent: parent }),
                      );
                      tempMap.set(tag, tempArr);
                    } else {
                      tempMap.set(tag, [
                        new OpenApiPath({ ...value.post, parent: parent }),
                      ]);
                    }
                  });
                }
              });
              return LoadRampActions.loadRampApiSuccess({ api: tempMap });
            },
            catchError((error: ErrorEvent) =>
              of(LoadRampActions.loadRampApiFailure({ error: error.message })),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchStats = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(LoadRampActions.loadRampStats),
      exhaustMap(() => {
        return rampService.loadAboutData().pipe(
          map(
            (ret: Stats) => {
              const data: Stats = ret as Stats;
              if (data) {
                return LoadRampActions.loadRampStatsSuccess({ data: data });
              } else {
                return LoadRampActions.loadRampStatsFailure({
                  error: 'No Stats Available',
                });
              }
            },
            catchError((error: ErrorEvent) =>
              of(
                LoadRampActions.loadRampStatsFailure({ error: error.message }),
              ),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchPathwaysFromAnalytes = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(
        PathwayFromAnalyteActions.fetchPathwaysFromAnalytes,
        PathwayEnrichmentsActions.fetchPathwaysFromAnalytes,
      ),
      exhaustMap((action) => {
        return rampService.fetchPathwaysFromAnalytes(action.analytes).pipe(
          map(
            (ret: RampResponse<Pathway>) => {
              ret.background = action.background;
              ret.backgroundFile = action.backgroundFile;
              ret.pval_type = action.pval_type;
              ret.pval_cutoff = action.pval_cutoff;
              ret.perc_analyte_overlap = action.perc_analyte_overlap;
              ret.min_pathway_tocluster = action.min_pathway_tocluster;
              ret.perc_pathway_overlap = action.perc_pathway_overlap;
              return PathwayFromAnalyteActions.fetchPathwaysFromAnalytesSuccess(
                ret,
              );
            },
            catchError((error: ErrorEvent) => {
              return of(
                PathwayFromAnalyteActions.fetchPathwaysFromAnalytesFailure({
                  error: error.message,
                }),
              );
            }),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchAnalytesFromPathways = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(AnalyteFromPathwayActions.fetchAnalytesFromPathways),
      exhaustMap((action) => {
        return rampService.fetchAnalytesFromPathways(action.pathways).pipe(
          map(
            (ret: RampResponse<Analyte>) => {
              return AnalyteFromPathwayActions.fetchAnalytesFromPathwaysSuccess(
                { ...ret },
              );
            },
            catchError((error: ErrorEvent) =>
              of(
                AnalyteFromPathwayActions.fetchAnalytesFromPathwaysFailure({
                  error: error.message,
                }),
              ),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchOntologiesFromMetabolites = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(OntologyFromMetaboliteActions.fetchOntologiesFromMetabolites),
      exhaustMap((action) => {
        return rampService
          .fetchOntologiesFromMetabolites(action.metabolites)
          .pipe(
            map(
              (ret: RampResponse<Ontology>) => {
                return OntologyFromMetaboliteActions.fetchOntologiesFromMetabolitesSuccess(
                  { ...ret },
                );
              },
              catchError((error: ErrorEvent) =>
                of(
                  OntologyFromMetaboliteActions.fetchOntologiesFromMetabolitesFailure(
                    { error: error.message },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchOntologies = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(MetaboliteFromOntologyActions.fetchOntologies),
      exhaustMap(() => {
        return rampService.fetchOntologies().pipe(
          map(
            (ret: { data: FilterCategory[] }) => {
              return MetaboliteFromOntologyActions.fetchOntologiesSuccess(ret);
            },
            catchError((error: ErrorEvent) =>
              of(
                MetaboliteFromOntologyActions.fetchOntologiesFailure({
                  error: error.message,
                }),
              ),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchMetabolitesFromOntologies = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(MetaboliteFromOntologyActions.fetchMetabolitesFromOntologies),
      exhaustMap((action) => {
        return rampService
          .fetchMetabolitesFromOntologies(action.ontologies)
          .pipe(
            map(
              (ret: RampResponse<Metabolite>) =>
                MetaboliteFromOntologyActions.fetchMetabolitesFromOntologiesSuccess(
                  ret,
                ),
              catchError((error: ErrorEvent) =>
                of(
                  MetaboliteFromOntologyActions.fetchMetaboliteFromOntologiesFailure(
                    { error: error.message },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchMetabolitesFromOntologiesFile = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(MetaboliteFromOntologyActions.fetchMetabolitesFromOntologiesFile),
      tap((action) =>
        rampService.fetchMetabolitesFromOntologiesFile(
          action.ontologies,
          action.format,
        ),
      ),
    );
  },
  { functional: true, dispatch: false },
);

export const fetchClassesFromMetabolites = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(
        ClassesFromMetabolitesActions.fetchClassesFromMetabolites,
        MetaboliteEnrichmentsActions.fetchClassesFromMetabolites,
      ),
      exhaustMap((action) => {
        return rampService
          .fetchChemicalClass(
            action.metabolites,
            action.background,
            action.backgroundFile,
          )
          .pipe(
            map(
              (ret: RampResponse<Classes>) =>
                ClassesFromMetabolitesActions.fetchClassesFromMetabolitesSuccess(
                  ret,
                ),
              catchError((error: ErrorEvent) =>
                of(
                  ClassesFromMetabolitesActions.fetchClassesFromMetabolitesFailure(
                    { error: error.message },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchPropertiesFromMetabolites = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolites),
      exhaustMap((action) => {
        return rampService
          .fetchPropertiesFromMetabolites(action.metabolites)
          .pipe(
            map(
              (ret: RampResponse<Properties>) =>
                PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolitesSuccess(
                  { ...ret },
                ),
              catchError((error: ErrorEvent) =>
                of(
                  PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolitesFailure(
                    { error: error.message },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchCommonReactionAnalytes = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(CommonReactionAnalyteActions.fetchCommonReactionAnalytes),
      exhaustMap((action) => {
        return rampService.fetchCommonReactionAnalytes(action.analytes).pipe(
          map(
            (ret: RampResponse<CommonAnalyte>) =>
              CommonReactionAnalyteActions.fetchCommonReactionAnalytesSuccess({
                ...ret,
              }),
            catchError((error: ErrorEvent) =>
              of(
                CommonReactionAnalyteActions.fetchCommonReactionAnalytesFailure(
                  { error: error.message },
                ),
              ),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchReactionsFromAnalytes = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(ReactionsFromAnalytesActions.fetchReactionsFromAnalytes),
      exhaustMap((action) => {
        return rampService
          .fetchReactionsFromAnalytes(
            action.analytes,
            action.onlyHumanMets,
            action.humanProtein,
            action.includeTransportRxns,
            action.rxnDirs,
            action.includeRxnURLs,
          )
          .pipe(
            map(
              (ret: RampResponse<Reaction>) => {
                return ReactionsFromAnalytesActions.fetchReactionsFromAnalytesSuccess(
                  {
                    ...ret,
                  },
                );
              },
              catchError((error: ErrorEvent) =>
                of(
                  ReactionsFromAnalytesActions.fetchReactionsFromAnalytesFailure(
                    { error: error.message },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchReactionClassesFromAnalytes = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(
        ReactionClassesFromAnalytesActions.fetchReactionClassesFromAnalytes,
      ),
      exhaustMap((action) => {
        return rampService
          .fetchReactionClassesFromAnalytes(
            action.analytes,
            action.multiRxnParticipantCount,
            action.humanProtein,
            action.concatResults,
            action.includeReactionIDs,
            action.useIdMapping,
          )
          .pipe(
            map(
              (ret: RampResponse<ReactionClass>) => {
                return ReactionClassesFromAnalytesActions.fetchReactionClassesFromAnalyteSuccess(
                  {
                    ...ret,
                  },
                );
              },
              catchError((error: ErrorEvent) =>
                of(
                  ReactionClassesFromAnalytesActions.fetchReactionClassesFromAnalyteFailure(
                    { error: error.message },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchPathwayAnalysis = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(PathwayEnrichmentsActions.fetchEnrichmentFromPathways),
      exhaustMap((action) => {
        return rampService
          .fetchEnrichmentFromPathways(
            action.analytes,
            action.background,
            action.backgroundFile,
          )
          .pipe(
            map(
              (ret: RampPathwayEnrichmentResponse) => {
                ret.background = action.background;
                ret.backgroundFile = action.backgroundFile;
                ret.pval_type = action.pval_type;
                ret.pval_cutoff = Number(action.pval_cutoff);
                ret.perc_analyte_overlap = Number(action.perc_analyte_overlap);
                ret.min_pathway_tocluster = Number(
                  action.min_pathway_tocluster,
                );
                ret.perc_pathway_overlap = Number(action.perc_pathway_overlap);
                return PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysSuccess(
                  ret,
                );
              },
              catchError((error: ErrorEvent) =>
                of(
                  PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysFailure({
                    error: error.message,
                  }),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const filterEnrichedPathways = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(
        PathwayEnrichmentsActions.filterEnrichmentFromPathways,
        PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysSuccess,
      ),
      concatLatestFrom(() => store.select(getCombinedFishersDataframe)),
      mergeMap(([action, dataframe]) => {
        if (dataframe) {
          return rampService
            .filterPathwayEnrichment(
              dataframe,
              action.pval_type,
              action.pval_cutoff,
            )
            .pipe(
              map(
                (ret: RampPathwayEnrichmentResponse) => {
                  return PathwayEnrichmentsActions.filterEnrichmentFromPathwaysSuccess(
                    {
                      ...ret,
                    },
                  );
                },
                catchError((error: ErrorEvent) =>
                  of(
                    PathwayEnrichmentsActions.filterEnrichmentFromPathwaysFailure(
                      { error: error.message },
                    ),
                  ),
                ),
              ),
            );
        } else {
          return of(
            PathwayEnrichmentsActions.filterEnrichmentFromPathwaysFailure({
              error: 'no dataframe available',
            }),
          );
        }
      }),
    );
  },
  { functional: true },
);

export const fetchPathwayCluster = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(
        PathwayEnrichmentsActions.filterEnrichmentFromPathwaysSuccess,
        PathwayEnrichmentsActions.fetchClusterFromEnrichment,
      ),
      concatLatestFrom(() => store.select(getFilteredFishersDataframe)),
      mergeMap(([action, dataframe]) => {
        if (dataframe) {
          return rampService
            .getClusterdData(
              dataframe,
              action.perc_analyte_overlap,
              action.min_pathway_tocluster,
              action.perc_pathway_overlap,
            )
            .pipe(
              map(
                (ret: {
                  data: RampPathwayEnrichmentResponse;
                  plot: string;
                }) => {
                  return PathwayEnrichmentsActions.fetchClusterFromEnrichmentSuccess(
                    {
                      data: ret.data.data,
                      plot: ret.plot,
                      query: ret.data.query,
                      dataframe: ret.data.combinedFishersDataframe,
                    },
                  );
                },
                catchError((error: ErrorEvent) =>
                  of(
                    PathwayEnrichmentsActions.fetchClusterFromEnrichmentFailure(
                      { error: error.message },
                    ),
                  ),
                ),
              ),
            );
        } else
          return of(
            PathwayEnrichmentsActions.fetchClusterFromEnrichmentFailure({
              error: 'no dataframe available',
            }),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchClusterImageFile = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(PathwayEnrichmentsActions.fetchClusterImageFile),
      concatLatestFrom(() => store.select(getClusterPlot)),
      tap(([action, plot]) => {
        if (plot && action) {
          return rampService.fetchClusterImageFile(plot);
        }
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const fetchChemicalAnalysis = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolites),
      exhaustMap((action) => {
        return rampService
          .fetchEnrichmentFromMetabolites(
            action.metabolites,
            action.background,
            action.backgroundFile,
          )
          .pipe(
            map(
              (ret: RampChemicalEnrichmentResponse) => {
                return MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesSuccess(
                  {
                    data: ret,
                  },
                );
              },
              catchError((error: ErrorEvent) =>
                of(
                  MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesFailure(
                    { error: error.message },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const filterEnrichedChemicalClasses = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(
        MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesSuccess,
        MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolites,
      ),
      concatLatestFrom(() => store.select(getChemicalEnrichment)),
      mergeMap(([action, dataframe]) => {
        if (dataframe) {
          return rampService
            .filterMetaboliteEnrichment(
              dataframe.data as RampChemicalEnrichmentResponse,
              action.pval_type,
              action.pval_cutoff,
            )
            .pipe(
              map(
                (ret: RampChemicalEnrichmentResponse) => {
                  return MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesSuccess(
                    { data: ret },
                  );
                },
                catchError((error: ErrorEvent) =>
                  of(
                    MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesFailure(
                      { error: error.message },
                    ),
                  ),
                ),
              ),
            );
        } else {
          return of(
            MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesFailure(
              { error: 'No dataframe available' },
            ),
          );
        }
      }),
    );
  },
  { functional: true },
);

export const fetchEnrichmentFromMetabolitesFile = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesFile),
      concatLatestFrom(() => store.select(getChemicalEnrichment)),
      tap(([action, dataframe]) => {
        if (action && dataframe) {
          rampService.fetchEnrichmentFromMetabolitesFile(
            dataframe.enriched_chemical_class_list,
          );
        }
      }),
    );
  },
  { functional: true, dispatch: false },
);

/*setSourceVersions = createEffect(() =>
   this.actions$.pipe(
     ofType(LoadRampActions.loadSourceVersions),
     mergeMap((action) =>
       this.rampService.fetchSourceVersions().pipe(
         map(
           (ret: SourceVersion[]) =>
             LoadRampActions.loadSourceVersionsSuccess({ versions: ret }),
           catchError((error: ErrorEvent) =>
             of(LoadRampActions.loadSourceVersionsFailure({ error })),
           ),
         ),
       ),
     ),
   ),
 );
*/
