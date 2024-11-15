import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataProperty } from '@ncats-frontend-library/models/utils';
import { DataMap, PanelAccordionComponent } from 'panel-accordion';
import { RampCorePageComponent } from 'ramp-core-page';
import { STRUCTURE_VIEWER_COMPONENT } from 'structure-viewer';
import {
  RampSelectors,
  PropertiesFromMetaboliteActions,
  MetaboliteEnrichmentsActions,
} from 'ramp-store';

@Component({
  selector: 'lib-chemical-descriptors-page',
  standalone: true,
  imports: [CommonModule, PanelAccordionComponent],
  templateUrl: './chemical-descriptors-page.component.html',
  styleUrl: './chemical-descriptors-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChemicalDescriptorsPageComponent extends RampCorePageComponent {
  propertiesColumns: DataProperty[] = [
    new DataProperty({
      label: 'Source ID',
      field: 'chem_source_id',
      sortable: true,
    }),
    /*    new DataProperty({
      label: "Common Name",
      field: "common_name",
      sortable: true
    }),*/
    new DataProperty({
      label: 'Metabolite',
      field: 'imageUrl',
      customComponent: STRUCTURE_VIEWER_COMPONENT,
    }),
    /*    new DataProperty({
      label: "Smiles",
      field: "iso_smiles"
    }),*/
    new DataProperty({
      label: 'InCHI',
      field: 'inchi',
    }),
    new DataProperty({
      label: 'InCHI Key',
      field: 'inchi_key',
    }),
    new DataProperty({
      label: 'Molecular Formula',
      field: 'mol_formula',
    }),
    new DataProperty({
      label: 'Mass',
      field: 'monoisotop_mass',
      sortable: true,
    }),
    new DataProperty({
      label: 'Molecular Weight',
      field: 'mw',
      sortable: true,
    }),
  ];
  classesColumns: DataProperty[] = [
    new DataProperty({
      label: 'Source IDs',
      field: 'sourceId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Names',
      field: 'commonNames',
    }),
    new DataProperty({
      label: 'ClassyFire Super Class',
      field: 'classyFireSuperClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'ClassyFire Class',
      field: 'classyFireClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'ClassyFire Sub Class',
      field: 'classyFireSubClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'LIPIDMAPS Category',
      field: 'lipidMapsCategory',
      sortable: true,
    }),
    new DataProperty({
      label: 'LIPIDMAPS Main Class',
      field: 'lipidMapsMainClass',
      sortable: true,
    }),
    new DataProperty({
      label: 'LIPIDMAPS Sub Class',
      field: 'lipidMapsSubClass',
      sortable: true,
    }),
    /*  new DataProperty({
      label: 'ClassyFire Classes',
      field: 'classyFireTree',
      customComponent: TREE_VIEWER_COMPONENT,
    }),
    new DataProperty({
      label: 'LIPIDMAPS Classes',
      field: 'lipidMapsTree',
      customComponent: TREE_VIEWER_COMPONENT,
    }),*/
  ];
  enrichmentColumns: DataProperty[] = [
    new DataProperty({
      label: 'Category',
      field: 'category',
      sortable: true,
      sorted: 'asc',
    }),
    new DataProperty({
      label: 'Class Name',
      field: 'class_name',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite Hits',
      field: 'met_hits',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pop hits',
      field: 'pop_hits',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite Count',
      field: 'met_size',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pop Count',
      field: 'pop_size',
      sortable: true,
    }),
    new DataProperty({
      label: 'P Value',
      field: 'pVal',
      sortable: true,
      displayType: 'string',
    }),
    new DataProperty({
      label: 'FDR P Value',
      field: 'pVal_FDR',
      sortable: true,
      displayType: 'string',
    }),
    new DataProperty({
      label: 'Holm P Value',
      field: 'pVal_Holm',
      sortable: true,
      displayType: 'string',
    }),
  ];

  chemicalProperties = this.store.selectSignal(RampSelectors.getProperties);
  chemicalClasses = this.store.selectSignal(RampSelectors.getClasses);
  chemicalEnrichment = this.store.selectSignal(
    RampSelectors.getChemicalEnrichment,
  );

  matches = computed(() =>
    Array.from(
      new Set(
        this.chemicalProperties()?.data.map((property) =>
          property.chem_source_id.toLocaleLowerCase(),
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
    const chemicalPropertiesData =
      this.chemicalProperties()?.dataAsDataProperty;
    if (chemicalPropertiesData) {
      returnDataMap.set('Chemical Properties', {
        data: chemicalPropertiesData,
        fields: this.propertiesColumns,
        dataframe: this.chemicalProperties()?.data,
        fileName: 'fetchPropertiesFromMetabolites-download.tsv',
      } as DataMap);
    }

    const chemicalClassesData = this.chemicalClasses()?.dataAsDataProperty;
    if (chemicalClassesData) {
      returnDataMap.set('Chemical Classes', {
        data: chemicalClassesData,
        fields: this.classesColumns,
        fileName: 'fetchChemicalClass-download.tsv',
        filters: this.filtersMap(),
        loaded: !!chemicalClassesData,
      });
    }

    const chemicalEnrichmentData =
      this.chemicalEnrichment()?.dataAsDataProperty;
    if (chemicalEnrichmentData) {
      returnDataMap.set('Enriched Pathways', {
        data: chemicalEnrichmentData,
        fields: this.enrichmentColumns,
        fileName: 'fetchEnrichedPathwaysFromAnalytes-download.tsv',
        filters: this.filtersMap(),
        loaded: !!chemicalEnrichmentData,
      });
    }

    if (returnDataMap.size) {
      return returnDataMap;
    } else return undefined;
  });

  overviewMap = computed(() => {
    if (this.chemicalProperties()?.data) {
      return {
        matches: this.matches(),
        noMatches: this.noMatches(),
        count: this.chemicalProperties()?.data.length,
        inputLength: this.inputList.length,
        inputType: 'analytes',
      };
    } else return undefined;
  });

  constructor() {
    super();
  }

  override fetchData(event: { [key: string]: unknown }): void {
    this.clearDataMapSignal();
    this.inputList = this._parseInput(
      event['metabolites'] as string | string[],
    );
    this.store.dispatch(
      PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolites({
        metabolites: this.inputList,
      }),
    );
    this.store.dispatch(
      MetaboliteEnrichmentsActions.fetchClassesFromMetabolites({
        metabolites: this.inputList,
        background: <string>event['background'],
        backgroundFile: event['backgroundFile'] as File,
      }),
    );
    this.store.dispatch(
      MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolites({
        metabolites: this.inputList,
        background: <string>event['background'],
        backgroundFile: event['backgroundFile'] as File,
      }),
    );
  }
}
