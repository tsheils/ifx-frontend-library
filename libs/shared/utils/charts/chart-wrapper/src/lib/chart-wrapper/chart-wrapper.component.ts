import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  signal,
  viewChild,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FilterCategory } from 'utils-models';
import { SharedUtilsBarChartComponent } from 'bar-chart';
import { SharedUtilsPieChartComponent } from 'pie-chart';
import { FilterDownloadButtonComponent } from 'filter-download-button';
import { GenericChartComponent } from 'generic-chart';
import { ImageDownloadComponent } from 'image-download';

@Component({
  selector: 'lib-chart-wrapper',
  imports: [
    CommonModule,
    SharedUtilsPieChartComponent,
    SharedUtilsBarChartComponent,
    ImageDownloadComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './chart-wrapper.component.html',
  styleUrl: './chart-wrapper.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartWrapperComponent implements OnInit {
  chartComponent = viewChild<GenericChartComponent>('chart');
  chartType = input<string>();
  filters = input<FilterCategory[]>();
  filterTypes = computed(() => this.filters()?.map((filter) => filter.label));
  selectedFilterLabel: WritableSignal<string> = signal('');
  selectedFilter = computed(
    () =>
      this.filters()?.filter(
        (filter) => filter.label === this.selectedFilterLabel?.(),
      )[0],
  );

  filterControl: FormControl<string | null> = new FormControl<string | null>(
    '',
  );

  ngOnInit() {
    const fil = this.filters();
    if (fil) {
      this.selectedFilterLabel.set(fil[0].label);
    }
    this.filterControl.setValue(this.selectedFilterLabel());

    this.filterControl.valueChanges.subscribe((filterLabel: string | null) => {
      if (filterLabel != null) {
        this.selectedFilterLabel.set(filterLabel);
      }
    });
  }
}
