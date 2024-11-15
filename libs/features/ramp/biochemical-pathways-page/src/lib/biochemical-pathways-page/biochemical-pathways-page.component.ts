import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { CompleteDialogComponent } from 'complete-dialog';
import { DataProperty } from '@ncats-frontend-library/models/utils';
import {
  DataMap,
  PanelAccordionComponent,
  VisualizationMap,
} from 'panel-accordion';
import { Ontology, Pathway } from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import {
  OntologyFromMetaboliteActions,
  PathwayEnrichmentsActions,
  RampSelectors,
} from 'ramp-store';

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

  computedDataColumns = computed(() => {
    let dataColumnsList = this.enrichmentColumns['both'];
    if (this.filteredDataframe() && this.filteredDataframe()?.analyteType) {
      dataColumnsList =
        this.enrichmentColumns[this.filteredDataframe()!.analyteType![0]];
    }
    return dataColumnsList;
  });

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
    const returnDataMap: Map<string, DataMap> = new Map<string, DataMap>();
    const pathwaysData = this.pathways()?.data;
    if (pathwaysData) {
      returnDataMap.set('Pathway Lookups', {
        data: this.pathways()?.dataAsDataProperty,
        fields: this.pathwayColumns,
        dataframe: pathwaysData,
        fileName: 'fetchPathwaysFromAnalytes-download.tsv',
        loaded: !!pathwaysData,
      } as DataMap);
    }

    const enrichedPathwaysData = this.enrichedPathways()?.dataAsDataProperty;
    if (enrichedPathwaysData) {
      returnDataMap.set('Enriched Pathways', {
        data: this.enrichedPathways()?.dataAsDataProperty,
        fields: this.computedDataColumns(),
        fileName: 'fetchEnrichedPathwaysFromAnalytes-download.tsv',
        filters: this.filtersMap(),
        loaded: !!enrichedPathwaysData,
      });
    }
    const noEnrichedPathwaysModalRef:
      | MatDialogRef<CompleteDialogComponent>
      | undefined = this.noEnrichedPathwaysModal();
    if (returnDataMap.size) {
      return returnDataMap;
    } else return undefined;
  });

  visualizationMap = computed(() => {
    const visualizationMapComputed = new Map<string, VisualizationMap[]>();
    let sizeMessage = undefined;
    if (!(this.clusterPlot() && this.clusterPlot()!.length > 0)) {
      sizeMessage =
        'This website currently does not support clustering over 100 pathways. Please use the RaMP R package for this feature.';
    }
    if (this.clusterPlot()) {
      visualizationMapComputed.set('Cluster Plot', [
        {
          type: 'cluster',
          data: {
            message: sizeMessage,
            image: this.sanitizer.bypassSecurityTrustHtml(
              <string>this.clusterPlot(),
            ),
          },
          loaded: !!this.clusterPlot(),
        },
      ] as VisualizationMap[]);
    }
    if (visualizationMapComputed.size) {
      return visualizationMapComputed;
    } else return undefined;
  });

  overviewMap = computed(() => {
    if (this.pathways()?.data) {
      return {
        matches: this.matches(),
        noMatches: this.noMatches(),
        count: this.pathways()?.data.length,
        inputLength: this.inputList.length,
        inputType: 'analytes',
      };
    } else return undefined;
  });

  noEnrichedPathwaysModal = computed(() => {
    console.log(this.enrichedPathways());
    if (
      this.enrichedPathways() &&
      this.enrichedPathways()?.data &&
      !this.enrichedPathways()?.data.length
    ) {
      return this.dialog.open(CompleteDialogComponent, {
        data: {
          title: 'Pathway',
          message: 'No enriched pathways found.',
        },
      });
    } else return undefined;
  });

  constructor() {
    super();
  }

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
