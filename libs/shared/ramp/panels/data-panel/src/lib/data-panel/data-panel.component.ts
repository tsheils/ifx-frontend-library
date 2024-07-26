import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataProperty, NcatsDatatableComponent } from 'ncats-datatable';

@Component({
  selector: 'lib-data-panel',
  standalone: true,
  imports: [CommonModule, NcatsDatatableComponent],
  templateUrl: './data-panel.component.html',
  styleUrl: './data-panel.component.scss',
})
export class DataPanelComponent implements OnChanges {
  @Input() dataColumns!: DataProperty[];
  @Input() dataAsDataProperty!: { [key: string]: DataProperty }[];
  noDataArr = false;

  ngOnChanges(change: { [n: string]: SimpleChange }) {
    if (
      change['dataAsDataProperty'] &&
      !change['dataAsDataProperty'].firstChange
    ) {
      if (
        !this.dataAsDataProperty.length ||
        this.dataAsDataProperty.length === 0
      ) {
        this.noDataArr = true;
      }
    }
  }
}
