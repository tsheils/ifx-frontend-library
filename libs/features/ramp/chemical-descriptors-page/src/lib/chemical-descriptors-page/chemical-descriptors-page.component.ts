import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs'
import {
  DataMap,
  DataProperty,
  QueryResultsData,
} from '@ncats-frontend-library/models/utils'
import { PanelAccordionComponent } from 'panel-accordion'
import { RampCorePageComponent } from 'ramp-core-page'
import { STRUCTURE_VIEWER_COMPONENT } from 'structure-viewer'
import {
  RampSelectors,
  PropertiesFromMetaboliteActions,
  MetaboliteEnrichmentsActions,
} from 'ramp-store'

@Component({
  selector: 'lib-chemical-descriptors-page',
  imports: [
    CommonModule,
    PanelAccordionComponent,
    MatTabGroup,
    MatTab,
    MatTabLabel,
  ],
  templateUrl: './chemical-descriptors-page.component.html',
  styleUrl: './chemical-descriptors-page.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
  ]
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
  ]
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
  ]

  chemicalProperties = this.store.selectSignal(RampSelectors.getProperties)
  chemicalClasses = this.store.selectSignal(RampSelectors.getClasses)
  chemicalEnrichment = this.store.selectSignal(
    RampSelectors.getChemicalEnrichment
  )

  override dataMap = computed(() => {
    const returnDataMap: Map<string, DataMap> = new Map<string, DataMap>()
    const field = <string>this.activeTab()
    let ret!: { [p: string]: Map<string, DataMap> }
    switch (field) {
      case 'chemical-properties': {
        const chemicalPropertiesData =
          this.chemicalProperties()?.dataAsDataProperty
        if (chemicalPropertiesData) {
          returnDataMap.set('Chemical Properties', {
            data: chemicalPropertiesData,
            fields: this.propertiesColumns,
            dataframe: this.chemicalProperties()?.data,
            fileName: 'fetchPropertiesFromMetabolites-download.tsv',
          } as DataMap)
        }
        break
      }
      case 'chemical-classes': {
        const chemicalClassesData = this.chemicalClasses()?.dataAsDataProperty
        if (chemicalClassesData) {
          returnDataMap.set('Chemical Classes', {
            data: chemicalClassesData,
            fields: this.classesColumns,
            fileName: 'fetchChemicalClass-download.tsv',
            filters: this.filtersMap(),
            loaded: !!chemicalClassesData,
          })
        }
        break
      }
      case 'chemical-class-enrichment': {
        const chemicalEnrichmentData =
          this.chemicalEnrichment()?.dataAsDataProperty
        if (chemicalEnrichmentData) {
          returnDataMap.set('Enriched Pathways', {
            data: chemicalEnrichmentData,
            fields: this.enrichmentColumns,
            fileName: 'fetchEnrichedPathwaysFromAnalytes-download.tsv',
            filters: this.filtersMap(),
            loaded: !!chemicalEnrichmentData,
          })
        }
      }
    }
    if (returnDataMap.size) {
      ret = { [field]: returnDataMap }
    }
    return ret
  })

  override overviewMap = computed(() => {
    const field = <string>this.activeTab()
    let ret!: { [p: string]: QueryResultsData }
    switch (field) {
      case 'chemical-properties': {
        if (this.chemicalProperties()?.data) {
          ret = {
            [field]: {
              matches: this.chemicalProperties()?.query?.matches,
              noMatches: this.chemicalProperties()?.query?.noMatches,
              count: this.chemicalProperties()?.data.length,
              inputLength: this.inputList.length,
              inputType: 'analytes',
              function: [this.chemicalProperties()?.query?.functionCall],
            } as QueryResultsData,
          }
        }
        break
      }
      case 'chemical-classes': {
        if (this.chemicalClasses()?.data) {
          ret = {
            [field]: {
              matches: this.chemicalClasses()?.query?.matches,
              noMatches: this.chemicalClasses()?.query?.noMatches,
              count: this.chemicalClasses()?.data.length,
              inputLength: this.inputList.length,
              inputType: 'analytes',
              function: [this.chemicalClasses()?.query?.functionCall],
            } as QueryResultsData,
          }
        }
        break
      }
      case 'chemical-class-enrichment': {
        if (this.chemicalEnrichment()?.data) {
          ret = {
            [field]: {
              matches: this.chemicalEnrichment()?.query?.matches,
              noMatches: this.chemicalEnrichment()?.query?.noMatches,
              // count: this.chemicalEnrichment()?.data.length,
              inputLength: this.inputList.length,
              inputType: 'analytes',
              function: [this.chemicalEnrichment()?.query?.functionCall],
            } as QueryResultsData,
          }
        }
        break
      }
    }
    return ret
  })

  constructor() {
    super()
  }

  override fetchData(
    formData: { [key: string]: unknown },
    origin: string
  ): void {
    this.activeTab.set(origin)
    switch (origin) {
      case 'chemical-properties': {
        this.inputList = this._parseInput(
          formData['metabolites'] as string | string[]
        )
        this.store.dispatch(
          PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolites({
            metabolites: this.inputList,
          })
        )
        break
      }

      case 'chemical-classes': {
        this.inputList = this._parseInput(
          formData['metabolites'] as string | string[]
        )
        this.store.dispatch(
          MetaboliteEnrichmentsActions.fetchClassesFromMetabolites({
            metabolites: this.inputList,
            background: <string>formData['background'],
            backgroundFile: formData['backgroundFile'] as File,
          })
        )
        break
      }
      case 'chemical-class-enrichment': {
        this.store.dispatch(
          MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolites({
            metabolites: this.inputList,
            background: <string>formData['background'],
            backgroundFile: formData['backgroundFile'] as File,
          })
        )
        break
      }
    }
  }
}
