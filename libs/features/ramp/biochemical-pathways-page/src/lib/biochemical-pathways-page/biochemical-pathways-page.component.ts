import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef } from '@angular/material/dialog';
import { select } from '@ngrx/store';
import { CompleteDialogComponent } from 'complete-dialog';
import { DataProperty } from '@ncats-frontend-library/models/utils';
import {
  DataMap,
  PanelAccordionComponent,
  VisualizationMap,
} from 'panel-accordion';
import {
  FisherResult,
  FishersDataframe,
  Ontology,
  Pathway,
  RampQuery,
  RampResponse,
} from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import {
  OntologyFromMetaboliteActions,
  PathwayEnrichmentsActions,
  RampSelectors,
} from 'ramp-store';
import { map } from 'rxjs';
import { getFilteredFishersDataframe } from '../../../../../../stores/ramp-store/src/lib/state/ramp.selectors';

@Component({
  selector: 'lib-biochemical-pathways-page',
  standalone: true,
  imports: [CommonModule, PanelAccordionComponent],
  templateUrl: './biochemical-pathways-page.component.html',
  styleUrl: './biochemical-pathways-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
//  implements OnInit
export class BiochemicalPathwaysPageComponent extends RampCorePageComponent {
  pathwayColumns: DataProperty[] = [
    new DataProperty({
      label: 'Input ID',
      field: 'inputId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway',
      field: 'pathwayName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway Source',
      field: 'pathwaySource',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway Source ID',
      field: 'pathwayId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte Name',
      field: 'commonName',
      sortable: true,
    }),
  ];
  ontologyColumns: DataProperty[] = [
    new DataProperty({
      label: 'Metabolites',
      field: 'metabolites',
      sortable: true,
    }),
    new DataProperty({
      label: 'Ontology',
      field: 'ontology',
      sortable: true,
    }),
    new DataProperty({
      label: 'Ontology Type',
      field: 'HMDBOntologyType',
      sortable: true,
    }),
    new DataProperty({
      label: 'Source ID',
      field: 'sourceId',
      sortable: true,
    }),
  ];
  private enrichedDataframe!: FishersDataframe;
  enrichmentColumns: {
    [key: string]: DataProperty[];
  } = {
    metabolites: [
      new DataProperty({
        label: 'Pathway Name',
        field: 'pathwayName',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Source',
        field: 'pathwaySource',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Id',
        field: 'pathwayId',
        sortable: true,
      }),
      /*      new DataProperty({
        label: 'Metabolite Count',
        field: 'metabCount',
      }),*/
      new DataProperty({
        label: 'Metabolite Count',
        field: 'pathCount',
      }),
      new DataProperty({
        label: 'Metabolites',
        field: 'analytes',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Pval',
        field: 'Pval',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined FDR Pval',
        field: 'Pval_FDR',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Holm Pval',
        field: 'Pval_Holm',
        sortable: true,
      }),
      new DataProperty({
        label: 'Cluster Assignment',
        field: 'cluster_assignment',
        sortable: true,
        sorted: 'asc',
      }),
    ],
    genes: [
      new DataProperty({
        label: 'Pathway Name',
        field: 'pathwayName',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Source',
        field: 'pathwaySource',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Id',
        field: 'pathwayId',
        sortable: true,
      }),
      /*     new DataProperty({
        label: 'Gene Count',
        field: 'geneCount',
      }),*/
      new DataProperty({
        label: 'Gene Count',
        field: 'pathCount',
      }),
      new DataProperty({
        label: 'Genes',
        field: 'analytes',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Pval',
        field: 'Pval',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined FDR Pval',
        field: 'Pval_FDR',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Holm Pval',
        field: 'Pval_Holm',
        sortable: true,
      }),
      new DataProperty({
        label: 'Cluster Assignment',
        field: 'cluster_assignment',
        sortable: true,
        sorted: 'asc',
      }),
    ],
    both: [
      new DataProperty({
        label: 'Pathway Name',
        field: 'pathwayName',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Source',
        field: 'pathwaySource',
        sortable: true,
      }),
      new DataProperty({
        label: 'Pathway Id',
        field: 'pathwayId',
        sortable: true,
      }),
      new DataProperty({
        label: 'Metabolite Count',
        field: 'metabCount',
      }),
      new DataProperty({
        label: 'Gene Count',
        field: 'geneCount',
      }),
      /* new DataProperty({
        label: 'Path Count',
        field: 'pathCount',
      }),*/
      new DataProperty({
        label: 'Analytes',
        field: 'analytes',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Pval',
        field: 'Pval_combined',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined FDR Pval',
        field: 'Pval_combined_FDR',
        sortable: true,
      }),
      new DataProperty({
        label: 'Combined Holm Pval',
        field: 'Pval_combined_Holm',
        sortable: true,
      }),
      new DataProperty({
        label: 'Cluster Assignment',
        field: 'cluster_assignment',
        sortable: true,
        sorted: 'asc',
      }),
    ],
  };

  previousValues!: { [key: string]: unknown };
  pathways = this.store.selectSignal(RampSelectors.getPathways);
  enrichedPathways = this.store.selectSignal(
    RampSelectors.getPathwayEnrichment,
  );
  ontologies = this.store.selectSignal(RampSelectors.getOntologies);
  clusterPlot = this.store.selectSignal(RampSelectors.getClusterPlot);
  filteredDataframe = this.store.selectSignal(
    RampSelectors.getFilteredFishersDataframe,
  );

  matches = computed(() =>
    Array.from(
      new Set(
        this.pathways()?.data.map((pathway) =>
          pathway.inputId.toLocaleLowerCase(),
        ),
      ),
    ),
  );
  noMatches = computed(() =>
    this.inputList.filter(
      (p: string) => !this.matches().includes(p.toLocaleLowerCase()),
    ),
  );

  dataMap = computed(() => {
    return new Map<string, DataMap>([
      [
        'Pathway Lookups',
        {
          data: this.pathways()?.dataAsDataProperty,
          fields: this.pathwayColumns,
          dataframe: this.pathways()?.data,
          fileName: 'fetchPathwaysFromAnalytes-download.tsv',
        } as DataMap,
      ],
      [
        'Ontology Lookups',
        {
          data: this.ontologies()?.dataAsDataProperty,
          fields: this.ontologyColumns,
          dataframe: this.ontologies()?.data,
          fileName: 'fetchOntologiesFromMetabolites-download.tsv',
        } as DataMap,
      ],
      [
        'Enriched Pathways',
        {
          data: this.enrichedPathways()?.dataAsDataProperty || undefined,
          fields: this.computedDataColumns(),
          /*   dataframe: this.enrichedPathways()?.dataframe
            ?.fishresults as unknown[],*/
          fileName: 'fetchEnrichedPathwaysFromAnalytes-download.tsv',
          filters: this.filtersMap(),
        },
      ],
    ]);
  });

  visualizationMap = computed(() => {
    const visualizationMapComputed = new Map<string, VisualizationMap[]>([
      [
        'Cluster Plot',
        [
          {
            type: 'cluster',
            data: {
              message: !(this.clusterPlot() && this.clusterPlot()!.length > 0)
                ? 'This website currently does not support clustering over 100 pathways.'
                : undefined,
              image: this.sanitizer.bypassSecurityTrustHtml(
                <string>this.clusterPlot(),
              ),
            },
          },
        ] as VisualizationMap[],
      ],
    ]);
    return visualizationMapComputed;
  });

  overviewMap = computed(() => {
    return {
      matches: this.matches(),
      noMatches: this.noMatches(),
      count: this.pathways()!.data.length,
      inputLength: this.inputList.length,
      inputType: 'analytes',
    };
  });

  private computedDataColumns = computed(() => {
    console.log(this.filteredDataframe());
    if (this.filteredDataframe()) {
      return this.enrichmentColumns[this.filteredDataframe()!.analyteType![0]];
    } else return [];
  });

  constructor() {
    super();
  }
  /*
  ngOnInit() {
    console.log(this);
    this.store
      .pipe(
        select(RampSelectors.getBiochemicalPathwaysResults),
        takeUntilDestroyed(this.destroyRef),
        map(
          (res: {
            pathways: RampResponse<Pathway> | undefined;
            pathwayEnrichment:
              | {
                  data: FisherResult[];
                  plot?: string[];
                  query?: RampQuery;
                  dataframe?: unknown;
                }
              | undefined;
            ontologies: RampResponse<Ontology> | undefined;
            clusterPlot: string | undefined;
          }) => {
            if (res.pathways && res.pathways.data) {
              //   this.mapPathways(res.pathways);
            }
            if (res.ontologies && res.ontologies.data) {
              //  this.mapOntologies(res.ontologies);
            }
            if (res.pathwayEnrichment && res.pathwayEnrichment.data) {
              if (!res.pathwayEnrichment.data.length) {
                const ref: MatDialogRef<CompleteDialogComponent> =
                  this.dialog.open(CompleteDialogComponent, {
                    data: {
                      title: 'Pathway',
                      message: 'No enriched pathways found.',
                    },
                  });
              } else {
                //  this.mapEnrichedPathways(res.pathwayEnrichment);
              }
            }
            if (res.clusterPlot) {
              //   this.mapClusterPlot(res.clusterPlot);
            }
            console.log(this.accordionPanelMap);
            // this.dataMapSignal = signal(this.accordionPanelMap);
            this.changeRef.markForCheck();
          },
        ),
      )
      .subscribe();
  }*/

  mapPathways(res: RampResponse<Pathway>) {
    /* this.accordionPanelMap.dataMap.set('Pathway Lookups', {
      data: this.pathways().dataAsDataProperty,
      fields: this.pathwayColumns,
      dataframe: res.dataframe,
      fileName: 'fetchPathwaysFromAnalytes-download.tsv',
    });
    const matches = Array.from(
      new Set(
        this.pathways()!.data.map((pathway) =>
          pathway.inputId.toLocaleLowerCase(),
        ),
      ),
    );
    const noMatches = this.inputList.filter(
      (p: string) => !matches.includes(p.toLocaleLowerCase()),
    );
    this.accordionPanelMap.overviewMap = {
      matches: matches,
      noMatches: noMatches,
      count: this.pathways()!.data.length,
      inputLength: this.inputList.length,
      inputType: 'analytes',
    };
    this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });
    if (res && res.query) {
      this.accordionPanelMap.overviewMap.function = <string>(
        res.query.functionCall
      );
    }*/
    console.log(res);
    console.log(this.accordionPanelMap);
  }

  mapEnrichedPathways(res: {
    data: FisherResult[];
    plot?: string[];
    query?: RampQuery;
    dataframe?: unknown;
  }) {
    if (res && res.dataframe) {
      const enrichedDataframe = res.dataframe as FishersDataframe;
      if (enrichedDataframe.analyteType) {
        this.dataColumns =
          this.enrichmentColumns[enrichedDataframe.analyteType[0]];
        // this.analyteType = enrichedDataframe.analyteType[0];
      }
      this.accordionPanelMap.dataMap.set('Enriched Pathways', {
        data: this._mapData(res.data),
        fields: this.dataColumns,
        dataframe: enrichedDataframe.fishresults as unknown[],
        fileName: 'fetchEnrichedPathwaysFromAnalytes-download.tsv',
        filters: this.filtersMap(),
      });
    } else {
      this.accordionPanelMap.dataMap.set('Enriched Pathways', {
        data: this._mapData(res.data),
        fields: this.dataColumns,
      });
    }
  }
  /*
  mapOntologies(res: RampResponse<Ontology>) {
    this.accordionPanelMap.dataMap.set('Ontology Lookups', {
      data: this._mapData(res.data),
      fields: this.ontologyColumns,
      dataframe: res.dataframe,
      fileName: 'fetchOntologiesFromMetabolites-download.tsv',
    });
  }

  mapClusterPlot(res: string) {
    this.accordionPanelMap.visualizationMap.set('Cluster Plot', [
      {
        type: 'cluster',
        data: {
          message: !(res.length > 0)
            ? 'This website currently does not support clustering over 100 pathways.'
            : undefined,
          image: this.sanitizer.bypassSecurityTrustHtml(res),
        },
      },
    ]);
    this.loadedEvent.emit({
      dataLoaded: true,
      resultsLoaded: true,
      visualizationsLoaded: true,
    });
  }*/

  override fetchData(formData: { [key: string]: unknown }): void {
    this.clearDataMapSignal();
    if (formData['analytes']) {
      this.inputList = this._parseInput(
        formData['analytes'] as string | string[],
      );
    }
    formData['analytes'] = this.inputList;

    this.store.dispatch(
      PathwayEnrichmentsActions.fetchPathwaysFromAnalytes({
        analytes: this.inputList,
      }),
    );
    this.store.dispatch(
      OntologyFromMetaboliteActions.fetchOntologiesFromMetabolites({
        metabolites: this.inputList,
      }),
    );
    const event = { ...this.previousValues, ...formData };
    this.store.dispatch(
      PathwayEnrichmentsActions.fetchEnrichmentFromPathways({
        analytes: this.inputList,
        background: <string>event['background'],
        backgroundFile: event['backgroundFile'] as File,
        pValType: <string>event['pValType'] || undefined,
        pValCutoff: Number(<number>event['pValCutoff']) || undefined,
        percAnalyteOverlap: <number>event['percAnalyteOverlap'] || undefined,
        minPathwayToCluster:
          Number(<number>event['minPathwayToCluster']) || undefined,
        percPathwayOverlap: <number>event['percPathwayOverlap'] || undefined,
      }),
    );
    this.previousValues = event;
  }
}
