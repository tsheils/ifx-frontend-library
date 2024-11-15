import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilsFilterPanelComponent } from '@ncats-frontend-library/shared/utils/filter-panel';
import { DataProperty } from '@ncats-frontend-library/models/utils';
import { OntologyPanelComponent } from 'ontology-panel';
import { DataMap, PanelAccordionComponent } from 'panel-accordion';
import { Metabolite } from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import { MetaboliteFromOntologyActions, RampSelectors } from 'ramp-store';

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
export class OntologiesPageComponent extends RampCorePageComponent {
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
  metabolitesFromOntologies = this.store.selectSignal(
    RampSelectors.getMetabolites,
  );

  matches = computed(() =>
    Array.from(
      new Set(
        this.metabolitesFromOntologies()?.data.map((metabolite) =>
          metabolite.ontologyTerm.toLocaleLowerCase(),
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
    const metabolitesFromOntologiesData =
      this.metabolitesFromOntologies()?.data;
    if (metabolitesFromOntologiesData) {
      returnDataMap.set('Metabolites', {
        data: this.metabolitesFromOntologies()?.dataAsDataProperty,
        fields: this.dataColumns,
        dataframe: metabolitesFromOntologiesData,
        fileName: 'fetchMetabolitesFromOntologies-download.tsv',
        loaded: !!metabolitesFromOntologiesData,
      } as DataMap);
    }

    if (returnDataMap.size) {
      return returnDataMap;
    } else return undefined;
  });

  overviewMap = computed(() => {
    if (this.metabolitesFromOntologies()?.data) {
      return {
        matches: this.matches(),
        noMatches: this.noMatches(),
        count: this.metabolitesFromOntologies()?.data.length,
        inputLength: this.inputList.length,
        inputType: 'ontologies',
      };
    } else return undefined;
  });

  constructor() {
    super();
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
