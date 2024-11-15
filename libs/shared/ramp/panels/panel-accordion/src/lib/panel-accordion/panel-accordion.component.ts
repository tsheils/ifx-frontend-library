import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import {
  OpenApiPath,
  QueryResultsData,
} from '@ncats-frontend-library/models/utils';
import { DataPanelComponent } from 'data-panel';
import { InputPanelComponent } from 'input-panel';
import { QuestionBase } from 'ncats-form-question';
import { ResultsPanelComponent } from 'results-panel';
import { VisualizationPanelComponent } from 'visualization-panel';
import {
  AccordionPanelMap,
  DataMap,
  VisualizationMap,
} from './panel-accordion-models';

@Component({
  selector: 'lib-panel-accordion',
  standalone: true,
  imports: [
    CommonModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelAccordionComponent {
  dataSearch = output<{ [key: string]: unknown }>();
  paths = input<OpenApiPath[]>();
  inputTab = input<Map<string, QuestionBase<string>[]>>();
  accordionTabsSignal = input<AccordionPanelMap>();
  /*  overviewTabs = computed(() => {
    console.log(this.accordionTabsSignal());
    return this.accordionTabsSignal()?.overviewMap;
  });*/
  /*  visualizationTabs = computed(
    () => this.accordionTabsSignal()?.visualizationMap,
  );*/
  visualizationTabs = input<Map<string, VisualizationMap[]> | undefined>(
    new Map<string, VisualizationMap[]>(),
  );
  dataTabs = input<Map<string, DataMap> | undefined>(undefined);
  overviewTabs = input<QueryResultsData | undefined>(new QueryResultsData());
  // dataTabs = computed(() => this.accordionTabsSignal()!.dataMap);

  searchData(event: { [key: string]: unknown }) {
    this.dataSearch.emit(event);
  }

  /*  checkIfLoaded(
    dataMap: Map<string, DataMap[] | VisualizationMap[] | undefined>,
  ) {
    console.log(dataMap);
    if (dataMap) {
      console.log(Array.from(dataMap.values())[0][0].loaded);
      return !Array.from(dataMap.values())[0][0].loaded;
    } else return false;
  }*/

  _originalOrder = () => 0;
}
