import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedUtilsFilterPanelComponent } from '@ncats-frontend-library/shared/utils/filter-panel';
import { select } from '@ngrx/store';
import { DataProperty } from '@ncats-frontend-library/models/utils';
import { OntologyPanelComponent } from 'ontology-panel';
import { PanelAccordionComponent } from 'panel-accordion';
import { Metabolite, RampResponse } from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import { MetaboliteFromOntologyActions, RampSelectors } from 'ramp-store';
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

  ontologies = this.store.selectSignal(RampSelectors.getontologiesList);

  constructor() {
    super();
  }

  ngOnInit() {
    this.store
      .pipe(
        select(RampSelectors.getMetabolites),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Metabolite> | undefined) => {
          if (res && res.data) {
            this.accordionPanelMap.dataMap.set('Metabolites', {
              data: this._mapData(res.data),
              fields: this.dataColumns,
              dataframe: res.data,
              fileName: 'fetchMetabolitesFromOntologies-download.tsv',
            });

            const matches = Array.from(
              new Set(
                res.data.map((data) => data.ontologyTerm.toLocaleLowerCase()),
              ),
            );
            const noMatches = this.inputList.filter(
              (p: string) => !matches.includes(p.toLocaleLowerCase()),
            );
            this.accordionPanelMap.overviewMap = {
              matches: matches,
              noMatches: noMatches,
              count: res.data.length,
              inputLength: this.inputList.length,
              fuzzy: true,
              inputType: 'pathways',
            };
            this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });
          }
          if (res && res.query) {
            this.accordionPanelMap.overviewMap.function = <string>(
              res.query.functionCall
            );
          }
          this.dataMapSignal.set(this.accordionPanelMap);
        }),
      )
      .subscribe();
  }

  downloadOntologyData(event: { [key: string]: unknown }) {
    this.store.dispatch(
      MetaboliteFromOntologyActions.fetchMetabolitesFromOntologiesFile({
        format: 'tsv',
        ontologies: event['ontologies'] as string[],
      }),
    );
  }
  override fetchData(event: { [key: string]: unknown }): void {
    this.clearDataMapSignal();
    this.store.dispatch(
      MetaboliteFromOntologyActions.fetchMetabolitesFromOntologies({
        ontologies: event['ontologies'] as string[],
      }),
    );
  }
}
