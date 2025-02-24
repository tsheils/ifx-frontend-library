import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core'
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion'
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs'
import {
  DataMap,
  OpenApiPath,
  QueryResultsData,
  VisualizationMap,
} from '@ncats-frontend-library/models/utils'
import { DataPanelComponent } from 'data-panel'
import { InputPanelComponent } from 'input-panel'
import { FormSubsection } from 'ramp'
import { ResultsPanelComponent } from 'results-panel'
import { VisualizationPanelComponent } from 'visualization-panel'

@Component({
  selector: 'lib-panel-accordion',
  imports: [
    CommonModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    DataPanelComponent,
    VisualizationPanelComponent,
    ResultsPanelComponent,
    InputPanelComponent,
    MatTabGroup,
    MatTab,
    MatTabContent,
  ],
  templateUrl: './panel-accordion.component.html',
  styleUrl: './panel-accordion.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelAccordionComponent {
  dataSearch = output<{ [key: string]: unknown }>()
  tabChangeEmitter = output<boolean>()
  paths = input<OpenApiPath[]>()
  inputTab = input<FormSubsection[]>()
  visualizationTabs = input<Map<string, VisualizationMap[]> | undefined>(
    new Map<string, VisualizationMap[]>()
  )
  dataTabs = input<Map<string, DataMap> | undefined>(undefined)
  overviewTabs = input<QueryResultsData | undefined>(new QueryResultsData())

  constructor(){
    console.log(this.paths())
  }

  searchData(event: { [key: string]: unknown }) {
    this.dataSearch.emit(event)
  }
  _originalOrder = () => 0
}
