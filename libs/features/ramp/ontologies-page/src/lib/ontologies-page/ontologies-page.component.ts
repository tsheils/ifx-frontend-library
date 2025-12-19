import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { DataMap, DataProperty, QueryResultsData } from 'utils-models';
import { OntologyPanelComponent } from 'ontology-panel';
import { PanelAccordionComponent } from 'panel-accordion';
import { RampPage } from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import {
  MetaboliteFromOntologyActions,
  OntologyEnrichmentsActions,
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
  ontologyEnrichmentDataColumns: DataProperty[] = [
    new DataProperty({
      label: 'Analytes',
      field: 'analytes',
      sortable: true,
    }),
    new DataProperty({
      label: 'Ontology',
      field: 'ontology',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pval',
      field: 'Pval',
      sortable: true,
    }),
    new DataProperty({
      label: 'FDR Pval',
      field: 'Pval_FDR',
      sortable: true,
    }),
    new DataProperty({
      label: 'Holm Pval',
      field: 'Pval_Holm',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite Odds Ratio',
      field: 'OR',
      sortable: true,
    }),
    new DataProperty({
      label: 'Ontology Ratio',
      field: 'ontologyAverage',
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

  ontologyEnrichment = this.store.selectSignal(
    RampSelectors.getOntologyEnrichment,
  );

  override dataMap = computed(() => {
    const returnDataMap: Map<string, DataMap> = new Map<string, DataMap>();
    const field = <string>this.activeTab();
    let ret!: { [p: string]: Map<string, DataMap> };
    switch (field) {
      case 'ontologies-from-metabolites': {
        const ontologiesFromMetabolitesData =
          this.ontologiesFromMetabolites()?.data;
        if (ontologiesFromMetabolitesData) {
          returnDataMap.set('Ontologies from Metabolites', {
            data: this.ontologiesFromMetabolites()?.dataAsDataProperty,
            fields: this.ontologyDataColumns,
            dataframe: ontologiesFromMetabolitesData,
            fileName: 'fetchOntologiesFromMetabolites-download.tsv',
            loaded: !!ontologiesFromMetabolitesData,
          } as DataMap);
        }
        break;
      }
      case 'metabolites-from-ontologies': {
        const metabolitesFromOntologiesData =
          this.metabolitesFromOntologies()?.data;
        if (metabolitesFromOntologiesData) {
          returnDataMap.set('Metabolites from Ontologies', {
            data: this.metabolitesFromOntologies()?.dataAsDataProperty,
            fields: this.ontologyDataColumns,
            dataframe: metabolitesFromOntologiesData,
            fileName: 'fetchMetabolitesFromOntologies-download.tsv',
            loaded: !!metabolitesFromOntologiesData,
          } as DataMap);
        }
        break;
      }
      case 'ontology-enrichment': {
        const ontologiesEnrichmentData =
          this.ontologyEnrichment()?.dataAsDataProperty;
        if (ontologiesEnrichmentData) {
          returnDataMap.set('Ontology Enrichment', {
            data: ontologiesEnrichmentData,
            fields: this.ontologyEnrichmentDataColumns,
            dataframe: this.ontologyEnrichment()?.data,
            fileName: 'fetchOntologiesEnrichment-download.tsv',
            loaded: !!ontologiesEnrichmentData,
          } as DataMap);
        }
        break;
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
    switch (field) {
      case 'ontologies-from-metabolites': {
        if (this.ontologiesFromMetabolites()?.data) {
          ret = {
            [field]: {
              matches: this.ontologiesFromMetabolites()?.query?.matches,
              noMatches: this.ontologiesFromMetabolites()?.query?.noMatches,
              count: this.ontologiesFromMetabolites()?.data.length,
              inputLength: this.inputList.length,
              inputType: 'metabolites',
              fuzzy: true,
              function: [this.ontologiesFromMetabolites()?.query?.functionCall],
            } as QueryResultsData,
          };
        }
        break;
      }
      case 'metabolites-from-ontologies': {
        if (this.metabolitesFromOntologies()?.data) {
          ret = {
            [field]: {
              matches: this.metabolitesFromOntologies()?.query?.matches,
              noMatches: this.metabolitesFromOntologies()?.query?.noMatches,
              count: this.metabolitesFromOntologies()?.data.length,
              inputLength: this.inputList.length,
              inputType: 'ontologies',
              fuzzy: true,
            } as QueryResultsData,
          };
        }
        break;
      }
      case 'ontology-enrichment': {
        if (this.ontologyEnrichment()?.data) {
          ret = {
            [field]: {
              matches: [],
              noMatches: [],
              count: this.ontologyEnrichment()?.data.length,
              inputLength: this.inputList.length,
              inputType: 'metabolites',
              function: [this.ontologyEnrichment()?.query?.functionCall],
            } as QueryResultsData,
          };
        }
        break;
      }
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
    if (formData['metabolites']) {
      this.inputList = this._parseInput(
        formData['metabolites'] as string | string[],
      );
    }
    switch (origin) {
      case 'metabolites-from-ontologies': {
        this.store.dispatch(
          MetaboliteFromOntologyActions.fetchMetabolitesFromOntologies({
            ontologies: formData['ontology'] as string[],
          }),
        );
        break;
      }
      case 'ontologies-from-metabolites': {
        this.store.dispatch(
          OntologyFromMetaboliteActions.fetchOntologiesFromMetabolites({
            metabolites: this.inputList,
          }),
        );
        break;
      }
      case 'ontology-enrichment': {
        this.store.dispatch(
          OntologyEnrichmentsActions.fetchOntologyEnrichment({
            metabolites: this.inputList,
          }),
        );
        break;
      }
    }
  }
}
