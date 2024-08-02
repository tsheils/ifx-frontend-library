import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DataDownloadButtonComponent } from 'data-download-button';
import { DataProperty, NcatsDatatableComponent } from 'ncats-datatable';

@Component({
  selector: 'lib-data-panel',
  standalone: true,
  imports: [CommonModule, NcatsDatatableComponent, MatButton, MatIcon, MatTooltip, DataDownloadButtonComponent],
  templateUrl: './data-panel.component.html',
  styleUrl: './data-panel.component.scss',
})
export class DataPanelComponent {
  dataframe = input<unknown[]>();
  dataColumns = input<DataProperty[]>();
  dataAsDataProperty = input<{ [key: string]: DataProperty }[]>();
  noDataArr = computed(() =>  !this.dataAsDataProperty()?.length || this.dataAsDataProperty()?.length === 0);
  fileName = input<string>();
}
