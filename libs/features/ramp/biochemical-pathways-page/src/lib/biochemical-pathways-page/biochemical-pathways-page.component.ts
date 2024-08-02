import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef } from '@angular/material/dialog';
import { select } from '@ngrx/store';
import { CompleteDialogComponent } from 'complete-dialog';
import { DataProperty } from 'ncats-datatable';
import { PanelAccordionComponent } from 'panel-accordion';
import {
  FisherResult,
  FishersDataframe,
  Pathway,
  RampQuery,
  RampResponse,
} from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import { PathwayEnrichmentsActions, RampSelectors } from 'ramp-store';
import { map } from 'rxjs';

@Component({
  selector: 'lib-biochemical-pathways-page',
  standalone: true,
  imports: [CommonModule, PanelAccordionComponent],
  templateUrl: './biochemical-pathways-page.component.html',
  styleUrl: './biochemical-pathways-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiochemicalPathwaysPageComponent
  extends RampCorePageComponent
  implements OnInit
{
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

  private analyteType!: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.store
      .pipe(
        select(RampSelectors.getPathways),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Pathway> | undefined) => {
          if (res && res.data) {
              this.dataMap.set('Pathway Lookups', {
                data: this._mapData(res.data),
                fields: this.pathwayColumns,
                dataframe: res.dataframe,
                fileName: "fetchPathwaysFromAnalytes-download.tsv"
              });
            const matches = Array.from(
              new Set(
                res.data.map((pathway) => pathway.inputId.toLocaleLowerCase()),
              ),
            );
            const noMatches = this.inputList.filter(
              (p: string) => !matches.includes(p.toLocaleLowerCase()),
            );
            this.resultsMap = {
              matches: matches,
              noMatches: noMatches,
              count: res.data.length,
              inputLength: this.inputList.length,
              inputType: 'analytes',
            };
            this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });
          }
          if (res && res.query) {
            this.resultsMap.function = <string>res.query.functionCall;
          }
          //   this.pathwaysLoading = false;
          this.changeRef.markForCheck();
        }),
      )
      .subscribe();

    this.store
      .pipe(
        select(RampSelectors.getPathwayEnrichment),
        takeUntilDestroyed(this.destroyRef),
        map(
          (
            res:
              | {
                  data: FisherResult[];
                  plot?: string[];
                  query?: RampQuery;
                  dataframe?: unknown;
                  openModal?: boolean;
                }
              | undefined,
          ) => {
            if (res && res.data) {
              if (!res.data.length) {
                const ref: MatDialogRef<CompleteDialogComponent> =
                  this.dialog.open(CompleteDialogComponent, {
                    data: {
                      title: 'Pathway',
                      message: 'No enriched pathways found.',
                    },
                  });
            }
            if (res && res.dataframe) {
              const enrichedDataframe = res.dataframe as FishersDataframe;
              if (enrichedDataframe.analyte_type) {
                this.dataColumns =
                  this.enrichmentColumns[
                    enrichedDataframe.analyte_type[0]
                  ];
                this.analyteType = enrichedDataframe.analyte_type[0];
              }
              this.dataMap.set('Enriched Pathways', {
                data: this._mapData(res.data),
                fields: this.dataColumns,
                dataframe: enrichedDataframe.fishresults as unknown[],
                fileName: 'fetchEnrichedPathwaysFromAnalytes-download.tsv'
              });
            } else {
              this.dataMap.set('Enriched Pathways', {
                data: this._mapData(res.data),
                fields: this.dataColumns,
              });}
            }
          },
        ),
      )
      .subscribe();

    this.store
      .pipe(
        select(RampSelectors.getClusterPlot),
        takeUntilDestroyed(this.destroyRef),
        map((res: string | undefined) => {
          if (res) {
            this.visualizationMap.set('Cluster Plot', [
              {
                type: 'cluster',
                data: {
                  tooBig: !(res.length > 0),
                  image: this.sanitizer.bypassSecurityTrustHtml(res),
                },
              },
            ]);
            this.loadedEvent.emit({
              dataLoaded: true,
              resultsLoaded: true,
              visualizationsLoaded: true,
            });
          }
          this.changeRef.markForCheck();
        }),
      )
      .subscribe();
  }

  override fetchData(event: { [key: string]: unknown }): void {
    super.fetchData();
    this.inputList = this._parseInput(event['analytes'] as string | string[]);
    event['analytes'] = this.inputList;

    this.store.dispatch(
      PathwayEnrichmentsActions.fetchPathwaysFromAnalytes({
        analytes: this.inputList,
      }),
    );

    this.store.dispatch(
        PathwayEnrichmentsActions.fetchEnrichmentFromPathways({
          analytes: this.inputList,
          background: <string>event['background'],
          backgroundFile: event['backgroundFile'] as File,
          pval_type: <string>event['pval_type'] || undefined,
          pval_cutoff: Number(<number>event['pval_cutoff']) || undefined,
          perc_analyte_overlap:
            <number>event['perc_analyte_overlap'] || undefined,
          min_pathway_tocluster:
            <number>event['min_pathway_tocluster'] || undefined,
          perc_pathway_overlap:
            <number>event['perc_pathway_overlap'] || undefined,
        }),
      );
  }

  /* override downloadData($event: { [p: string]: unknown }) {

  }*/
}
