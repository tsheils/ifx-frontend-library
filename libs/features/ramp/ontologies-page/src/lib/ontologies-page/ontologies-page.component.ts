import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import {
  DataMap,
  DataProperty,
  QueryResultsData,
} from '@ncats-frontend-library/models/utils';
import { OntologyPanelComponent } from 'ontology-panel';
import { PanelAccordionComponent } from 'panel-accordion';
import { Metabolite, RampPage } from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import {
  MetaboliteFromOntologyActions,
  OntologyFromMetaboliteActions,
  RampSelectors,
} from 'ramp-store';

@Component({
  selector: 'lib-ontologies-page',
  imports: [
    CommonModule,
    PanelAccordionComponent,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    OntologyPanelComponent,
  ],
  templateUrl: './ontologies-page.component.html',
  styleUrl: './ontologies-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
  ontologyDataColumns: DataProperty[] = [
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

  ontologies = this.store.selectSignal(RampSelectors.getontologiesList);
  ontologiesFromMetabolites = this.store.selectSignal(
    RampSelectors.getOntologies,
  );
  metabolitesFromOntologies = this.store.selectSignal(
    RampSelectors.getMetabolites,
  );

  override dataMap = computed(() => {
    const returnDataMap: Map<string, DataMap> = new Map<string, DataMap>();
    const field = <string>this.activeTab();
    let ret!: { [p: string]: Map<string, DataMap> };
    if (field == 'ontologies-from-metabolites') {
      const ontologiesFromMetabolitesData =
        this.ontologiesFromMetabolites()?.data;
      if (ontologiesFromMetabolitesData) {
        returnDataMap.set('Metabolites', {
          data: this.ontologiesFromMetabolites()?.dataAsDataProperty,
          fields: this.ontologyDataColumns,
          dataframe: ontologiesFromMetabolitesData,
          fileName: 'fetchOntologiesFromMetabolites-download.tsv',
          loaded: !!ontologiesFromMetabolitesData,
        } as DataMap);
      }
    }

    if (returnDataMap.size) {
      ret = { [field]: returnDataMap };
    }
    return ret;
  });

  override overviewMap = computed(() => {
    const field = <string>this.activeTab();
    let ret!: { [p: string]: QueryResultsData };
    if (field == 'ontologies-from-metabolites') {
      if (this.ontologiesFromMetabolites()?.data) {
        ret = {
          [field]: {
            matches: this.ontologiesFromMetabolites()?.query?.matches,
            noMatches: this.ontologiesFromMetabolites()?.query?.noMatches,
            count: this.ontologiesFromMetabolites()?.data.length,
            inputLength: this.inputList.length,
            inputType: 'metabolites',
            fuzzy: true,
          } as QueryResultsData,
        };
      }
    } else {
      ret = (<unknown>undefined) as { [p: string]: QueryResultsData };
    }
    return ret;
  });

  constructor() {
    super();
  }

  _getMapField(field: string): RampPage {
    return this.mainPageMap()!.get(field) as RampPage;
  }

  downloadOntologyData(event: { [key: string]: unknown }) {
    this.store.dispatch(
      MetaboliteFromOntologyActions.fetchMetabolitesFromOntologiesFile({
        format: 'tsv',
        ontologies: event['ontologies'] as string[],
      }),
    );
  }

  override fetchData(
    formData: { [key: string]: unknown },
    origin: string,
  ): void {
    this.activeTab.set(origin);
    if (origin === 'metabolites-from-ontologies') {
      this.store.dispatch(
        MetaboliteFromOntologyActions.fetchMetabolitesFromOntologies({
          ontologies: formData['ontology'] as string[],
        }),
      );
    } else {
      this.store.dispatch(
        OntologyFromMetaboliteActions.fetchOntologiesFromMetabolites({
          metabolites: formData['metabolites'] as string[],
        }),
      );
    }
  }
}
