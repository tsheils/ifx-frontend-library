import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DataProperty } from '@ncats-frontend-library/models/utils';
import { DataDownloadButtonComponent } from 'data-download-button';
import { NcatsDatatableComponent } from 'ncats-datatable';

@Component({
  selector: 'lib-data-panel',
  imports: [
    CommonModule,
    NcatsDatatableComponent,
    MatButton,
    MatIcon,
    MatTooltip,
    DataDownloadButtonComponent,
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
