import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import {
  DataMap,
  OpenApiPath,
  QueryResultsData,
  VisualizationMap,
} from 'utils-models';
import { DataDownloadButtonComponent } from 'data-download-button';
import { DataPanelComponent } from 'data-panel';
import { InputPanelComponent } from 'input-panel';
import { FormSubsection } from 'ramp';
import { ResultsPanelComponent } from 'results-panel';
import { VisualizationPanelComponent } from 'visualization-panel';

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
    DataDownloadButtonComponent,
    MatButton,
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './panel-accordion.component.html',
  styleUrl: './panel-accordion.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelAccordionComponent {
  dataSearch = output<{ [key: string]: unknown }>();
  tabChangeEmitter = output<boolean>();
  paths = input<OpenApiPath[]>();
  inputTab = input<FormSubsection[]>();
  filterTab = input<FormSubsection[]>();
  visualizationTabs = input<Map<string, VisualizationMap[]> | undefined>(
    new Map<string, VisualizationMap[]>()
  );
  dataTabs = input<Map<string, DataMap> | undefined>(undefined);
  overviewTabs = input<QueryResultsData | undefined>(new QueryResultsData());
  showFilters = signal<boolean>(true);

  searchData(event: { [key: string]: unknown }) {
    this.dataSearch.emit(event);
  }
  _originalOrder = () => 0;
}
