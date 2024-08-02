import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from '@ngrx/store';
import { DataProperty } from 'ncats-datatable';
import { PanelAccordionComponent } from 'panel-accordion';
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
  selector: 'lib-chemical-properties-page',
  standalone: true,
  imports: [CommonModule, PanelAccordionComponent],
  templateUrl: './chemical-properties-page.component.html',
  styleUrl: './chemical-properties-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChemicalPropertiesPageComponent
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

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.store
      .pipe(
        select(RampSelectors.getProperties),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Properties> | undefined) => {
          if (res && res.data) {
            const retData = this._mapData(res.data).map((prop) => {
              prop['imageUrl'].url =
                `${this.renderUrl()}(${encodeURIComponent(prop['iso_smiles'].value)})?size=150`;
              prop['imageUrl'].label = prop['common_name'].value;
              return prop;
            });
            this.dataMap.set('Chemical Properties', {
              data: retData,
              fields: this.propertiesColumns,
              dataframe: res.dataframe,
              fileName: 'fetchPropertiesFromMetabolites-download.tsv'

            });
            const matches = Array.from(
              new Set(
                res.data.map((property) =>
                  property.chem_source_id.toLocaleLowerCase(),
                ),
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
              inputType: 'metabolites',
            };
          }
          if (res && res.query) {
            this.resultsMap.function = <string>res.query.functionCall;
          }
        }),
      )
      .subscribe();

    this.store
      .pipe(
        select(RampSelectors.getClasses),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Classes> | undefined) => {
          if (res && res.data) {
            this.dataMap.set('Chemical Classes', {
              data: this._mapData(res.data),
              fields: this.classesColumns,
              dataframe: res.dataframe,
              fileName: 'fetchChemicalClass-download.tsv'
            });
            const matches = Array.from(
              new Set(
                res.data.map((property) =>
                  property.sourceId.toLocaleLowerCase(),
                ),
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
              inputType: 'metabolites',
            };
            this.loadedEvent.emit({ dataLoaded: true, resultsLoaded: true });
          }
          if (res && res.query) {
            this.resultsMap.function = <string>res.query.functionCall;
          }
        }),
      )
      .subscribe();

    this.store
      .pipe(
        select(RampSelectors.getChemicalEnrichment),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampChemicalEnrichmentResponse | undefined) => {
          if (res && res.enriched_chemical_class_list) {
            this.dataMap.set('Enriched Chemical Classes', {
              data: this._mapData(res.enriched_chemical_class_list),
              fields: this.enrichmentColumns,
              dataframe: res.enriched_chemical_class_list,
              fileName: 'fetchEnrichedChemicalClasses-download.tsv'
            });
          }
          //   this.pathwaysLoading = false;
          this.changeRef.markForCheck();
        }),
      )
      .subscribe();
  }

  override fetchData(event: { [key: string]: unknown }): void {
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
