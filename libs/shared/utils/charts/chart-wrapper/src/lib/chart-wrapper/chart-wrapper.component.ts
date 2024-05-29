import {
  Component,
  computed,
  input,
  OnInit,
  signal,
  ViewChild,
  WritableSignal
} from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { FilterCategory } from "@ncats-frontend-library/models/utils";
import { SharedUtilsBarChartComponent } from "@ncats-frontend-library/shared/utils/bar-chart";
import { SharedUtilsPieChartComponent } from "@ncats-frontend-library/shared/utils/pie-chart";
import { FilterDownloadButtonComponent } from "filter-download-button";
import { GenericChartComponent } from "generic-chart";
import { ImageDownloadComponent } from "image-download";

@Component({
  selector: 'lib-chart-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    SharedUtilsPieChartComponent,
    SharedUtilsBarChartComponent,
    FilterDownloadButtonComponent,
    ImageDownloadComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './chart-wrapper.component.html',
  styleUrl: './chart-wrapper.component.scss',
})
export class ChartWrapperComponent implements OnInit {
  @ViewChild('chart', { static: false }) chartComponent!: GenericChartComponent;
  chartType = input<string>();
  filters = input<FilterCategory[]>();
  filterTypes= computed(() => this.filters()?.map(filter => filter.label));
  selectedFilterLabel: WritableSignal<string> = signal('');
  selectedFilter = computed(()=> this.filters()?.filter(filter=> filter.label === this.selectedFilterLabel?.())[0])

  filterControl: FormControl<string | null> = new FormControl<string | null>('');

  ngOnInit(){
    const fil = this.filters();
    if(fil) {
      this.selectedFilterLabel.set(fil[0].label);
    }
    this.filterControl.setValue(this.selectedFilterLabel());

    this.filterControl
      .valueChanges
      .subscribe(
        (filterLabel: string | null) => {
          if (filterLabel != null) {
            this.selectedFilterLabel.set(filterLabel);
          }
        })
  }
}
