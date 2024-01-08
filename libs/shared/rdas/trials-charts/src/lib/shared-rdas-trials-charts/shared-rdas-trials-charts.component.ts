import { Component, computed, Input, signal, Signal, WritableSignal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { FilterCategory } from "@ncats-frontend-library/models/utils";
import { SharedUtilsPieChartComponent } from "@ncats-frontend-library/shared/utils/pie-chart";

@Component({
  selector: 'lib-shared-rdas-trials-charts',
  standalone: true,
  imports: [
    CommonModule,
    SharedUtilsPieChartComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],  templateUrl: './shared-rdas-trials-charts.component.html',
  styleUrl: './shared-rdas-trials-charts.component.scss',
})
export class SharedRdasTrialsChartsComponent {
  @Input() filters!: FilterCategory[];
  filterTypes: Signal<string[]> = computed(() => this.filters!.map(filter => filter.label));
  selectedFilterLabel: WritableSignal<string> = signal('');
  selectedFilter: Signal<FilterCategory> = computed(()=> this.filters?.filter(filter=> filter.label === this.selectedFilterLabel!())[0])

  filterControl: FormControl<string | null> = new FormControl<string | null>('');

  constructor() {

  }

  ngOnInit(){
    this.selectedFilterLabel.set(this.filters[0].label);
    this.filterControl.setValue(this.selectedFilterLabel());


    this.filterControl
      .valueChanges
      .subscribe(
        (filterLabel: string | null) => {
          this.selectedFilterLabel.set(filterLabel!);
        })
  }
}
