import {
  Component,
  EventEmitter,
  input,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { SafeHtml } from '@angular/platform-browser';
import {
  HierarchyNode,
  OpenApiPath,
} from '@ncats-frontend-library/models/utils';
import { DataPanelComponent } from 'data-panel';
import { InputPanelComponent } from 'input-panel';
import { DataProperty } from 'ncats-datatable';
import { QuestionBase } from 'ncats-form-question';
import { RampResults } from 'ramp';
import { ResultsPanelComponent } from 'results-panel';
import { VisualizationPanelComponent } from 'visualization-panel';

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
})
export class PanelAccordionComponent {
  @Output() dataSearch: EventEmitter<{ [key: string]: unknown }> =
    new EventEmitter<{ [key: string]: unknown }>();
  @Output() dataDownload: EventEmitter<{ [key: string]: unknown }> =
    new EventEmitter<{ [key: string]: unknown }>();
  @Input() paths?: OpenApiPath[];
  @Input() inputTab!: Map<string, QuestionBase<string>[]>;
  @Input() resultsTabs!: RampResults;

  visualizationTabs = input<
    Map<
      string,
      {
        type: string;
        data: { tooBig?: boolean; image?: SafeHtml; values?: HierarchyNode[] };
      }[]
    >
  >();
  @Input() dataTabs!: Map<
    string,
    { data: { [key: string]: DataProperty }[]; fields: DataProperty[] }
  >;

  searchData(event: { [key: string]: unknown }) {
    this.dataSearch.emit(event);
  }
  downloadData(event: { [key: string]: unknown }) {
    this.dataDownload.emit(event);
  }

  _originalOrder = () => 0;
}
