import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Filter, FilterCategory } from '@ncats-frontend-library/models/utils';
import { SharedUtilsFilterPanelComponent } from '@ncats-frontend-library/shared/utils/filter-panel';
import { select } from '@ngrx/store';
import { DataProperty } from 'ncats-datatable';
import { OntologyPanelComponent } from 'ontology-panel';
import { PanelAccordionComponent } from 'panel-accordion';
import { Metabolite, RampResponse } from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import {
  AnalyteFromPathwayActions,
  MetaboliteFromOntologyActions,
  RampSelectors,
} from 'ramp-store';
import { map } from 'rxjs';

@Component({
  selector: 'lib-ontologies-page',
  standalone: true,
  imports: [
    CommonModule,
    PanelAccordionComponent,
    SharedUtilsFilterPanelComponent,
    OntologyPanelComponent,
  ],
  templateUrl: './ontologies-page.component.html',
  styleUrl: './ontologies-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OntologiesPageComponent
  extends RampCorePageComponent
  implements OnInit
{
  override dataColumns: DataProperty[] = [
    new DataProperty({
      label: 'Ontology',
      field: 'ontologyTerm',
      sortable: true,
    }),
    new DataProperty({
      label: 'Ontology Type',
      field: 'ontologyCategory',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite',
      field: 'metNames',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite IDs',
      field: 'metIds',
      sortable: true,
    }),
  ];

  ontologies!: FilterCategory[];
  allOntologies!: FilterCategory[];
  selectedOntologies: Filter[] = [];
  globalFilter?: string;
  disableSearch = false;
  loading = false;

  constructor() {
    super();
  }

  ngOnInit() {
    this.store.dispatch(MetaboliteFromOntologyActions.fetchOntologies());

    this.store
      .pipe(
        select(RampSelectors.getontologiesList),
        takeUntilDestroyed(this.destroyRef),
        map((res: FilterCategory[] | undefined) => {
          if (res && res.length) {
            this.ontologies = res;
            this.allOntologies = res;
            this.changeRef.markForCheck();
          }
        }),
      )
      .subscribe();

    this.store
      .pipe(
        select(RampSelectors.getMetabolites),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Metabolite> | undefined) => {
          if (res && res.data) {
            this.dataMap.set('Metabolites', {
              data: this._mapData(res.data),
              fields: this.dataColumns,
            });
            const matches = Array.from(
              new Set(
                res.data.map((data) => data.ontologyTerm.toLocaleLowerCase()),
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
              fuzzy: true,
              inputType: 'pathways',
            };
            this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });
          }
          if (res && res.dataframe) {
            this.dataframe = res.dataframe;
            if (this.downloadQueued) {
              this._downloadFile(
                this._toTSV(this.dataframe),
                'fetchMetabolitesFromOntologies-download.tsv',
              );
              this.downloadQueued = false;
            }
          }
          if (res && res.query) {
            this.resultsMap.function = <string>res.query.functionCall;
          }
          //   this.pathwaysLoading = false;
          this.changeRef.markForCheck();
        }),
      )
      .subscribe();
  }

  override fetchData(event: { [key: string]: unknown }): void {
    this.store.dispatch(
      MetaboliteFromOntologyActions.fetchMetabolitesFromOntologies({
        ontologies: event['ontologies'] as string[],
      }),
    );
  }

  override downloadData(event: { [key: string]: unknown }) {
    super.downloadData(event, 'fetchMetabolitesFromOntologies-download.tsv');
  }
}
