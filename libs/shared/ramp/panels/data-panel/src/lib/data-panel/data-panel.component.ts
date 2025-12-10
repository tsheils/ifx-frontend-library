import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IfxDatatableComponent } from 'ifx-datatable';
import { DataProperty } from 'utils-models';
import { DataDownloadButtonComponent } from 'data-download-button';

@Component({
  selector: 'lib-data-panel',
  imports: [
    CommonModule,
    DataDownloadButtonComponent,
    IfxDatatableComponent
  ],
  templateUrl: './data-panel.component.html',
  styleUrl: './data-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DataPanelComponent {
  dataColumns = input<DataProperty[]>();
  dataAsDataProperty = input<{ [key: string]: DataProperty }[]>();
  noDataArr = computed(
    () =>
      !this.dataAsDataProperty()?.length ||
      this.dataAsDataProperty()?.length === 0
  );
  dataSearch = output<{ [key: string]: unknown }>();

  searchData(event: { [key: string]: unknown }) {
    this.dataSearch.emit(event);
  }
}
