import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef } from '@angular/material/dialog';
import { DataProperty } from '@ncats-frontend-library/models/utils';
import { select } from '@ngrx/store';
import { CompleteDialogComponent } from 'complete-dialog';
import {
  DataMap,
  PanelAccordionComponent,
  VisualizationMap,
} from 'panel-accordion';
import {
  Classes,
  Properties,
  RampChemicalEnrichmentResponse,
  RampResponse,
} from 'ramp';
import { RampCorePageComponent } from 'ramp-core-page';
import { STRUCTURE_VIEWER_COMPONENT } from 'structure-viewer';
import {
  RampSelectors,
  PropertiesFromMetaboliteActions,
  MetaboliteEnrichmentsActions,
} from 'ramp-store';
import { map } from 'rxjs';

@Component({
  selector: 'lib-chemical-descriptors-page',
  standalone: true,
  imports: [CommonModule, PanelAccordionComponent],
  templateUrl: './chemical-descriptors-page.component.html',
  styleUrl: './chemical-descriptors-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChemicalDescriptorsPageComponent
  extends RampCorePageComponent
  implements OnInit
{
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
      field: 'p_value',
      sortable: true,
      displayType: 'string',
    }),
    new DataProperty({
      label: 'adjP_BH',
      field: 'adjP_BH',
      sortable: true,
      displayType: 'string',
    }),
  ];
  renderUrl = input<string>();

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

    console.log(this.chemicalEnrichment());
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

  ngOnInit(): void {
    /*    this.store
      .pipe(
        select(RampSelectors.getChemicalPropertyResults),
        takeUntilDestroyed(this.destroyRef),
        map(
          (
            chemicalPropertyResults:
              | {
                  chemicalProperties: RampResponse<Properties> | undefined;
                  chemicalClasses: RampResponse<Classes> | undefined;
                  chemicalEnrichment:
                    | RampChemicalEnrichmentResponse
                    | undefined;
                }
              | undefined,
          ) => {
            if (
              chemicalPropertyResults &&
              chemicalPropertyResults.chemicalProperties
            ) {
              this.mapChemicalProperties(
                chemicalPropertyResults.chemicalProperties,
              );
            }
            if (
              chemicalPropertyResults &&
              chemicalPropertyResults.chemicalClasses
            ) {
              this.mapChemicalClasses(chemicalPropertyResults.chemicalClasses);
            }
            if (
              chemicalPropertyResults &&
              chemicalPropertyResults.chemicalEnrichment
            ) {
              this.mapChemicalEnrichment(
                chemicalPropertyResults.chemicalEnrichment,
              );
            }
          },
        ),
      )
      .subscribe();*/
  }

  mapChemicalProperties(chemicalProperties: RampResponse<Properties>) {
    if (chemicalProperties && chemicalProperties.data) {
      const retData = this._mapData(chemicalProperties.data).map((prop) => {
        prop['imageUrl'].url =
          `${this.renderUrl()}(${encodeURIComponent(prop['iso_smiles'].value)})?size=150`;
        prop['imageUrl'].label = prop['common_name'].value;
        return prop;
      });
      this.accordionPanelMap.dataMap.set('Chemical Properties', {
        data: retData,
        fields: this.propertiesColumns,
        dataframe: chemicalProperties.data,
        fileName: 'fetchPropertiesFromMetabolites-download.tsv',
      });
      const matches = Array.from(
        new Set(
          chemicalProperties.data.map((property) =>
            property.chem_source_id.toLocaleLowerCase(),
          ),
        ),
      );
      const noMatches = this.inputList.filter(
        (p: string) => !matches.includes(p.toLocaleLowerCase()),
      );
      this.accordionPanelMap.overviewMap = {
        matches: matches,
        noMatches: noMatches,
        count: chemicalProperties.data.length,
        inputLength: this.inputList.length,
        inputType: 'metabolites',
      };
    }
    if (chemicalProperties && chemicalProperties.query) {
      this.accordionPanelMap.overviewMap.function = <string>(
        chemicalProperties.query.functionCall
      );
    }
  }

  mapChemicalClasses(chemicalClasses: RampResponse<Classes>) {
    if (chemicalClasses && chemicalClasses.data) {
      this.accordionPanelMap.dataMap.set('Chemical Classes', {
        data: this._mapData(chemicalClasses.data),
        fields: this.classesColumns,
        dataframe: chemicalClasses.data,
        fileName: 'fetchChemicalClass-download.tsv',
      });
      const matches = Array.from(
        new Set(
          chemicalClasses.data.map((property) =>
            property.sourceId.toLocaleLowerCase(),
          ),
        ),
      );
      const noMatches = this.inputList.filter(
        (p: string) => !matches.includes(p.toLocaleLowerCase()),
      );
      this.accordionPanelMap.overviewMap = {
        matches: matches,
        noMatches: noMatches,
        count: chemicalClasses.data.length,
        inputLength: this.inputList.length,
        inputType: 'metabolites',
      };
      this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });
    }
    if (chemicalClasses && chemicalClasses.query) {
      this.accordionPanelMap.overviewMap.function = <string>(
        chemicalClasses.query.functionCall
      );
    }
  }

  mapChemicalEnrichment(enrichmentResponse: RampChemicalEnrichmentResponse) {
    if (enrichmentResponse && enrichmentResponse.enriched_chemical_class_list) {
      this.accordionPanelMap.dataMap.set('Enriched Chemical Classes', {
        data: this._mapData(enrichmentResponse.enriched_chemical_class_list),
        fields: this.enrichmentColumns,
        dataframe: enrichmentResponse.enriched_chemical_class_list,
        fileName: 'fetchEnrichedChemicalClasses-download.tsv',
      });
    }
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
