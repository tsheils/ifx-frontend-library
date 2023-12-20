import { Component, computed, Input, signal, Signal, WritableSignal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { FilterCategory } from "@ncats-frontend-library/models/utils";
import { SharedUtilsBarChartComponent } from "@ncats-frontend-library/shared/utils/bar-chart";

@Component({
  selector: 'lib-shared-rdas-article-charts',
  standalone: true,
  imports: [
  CommonModule,
  SharedUtilsBarChartComponent,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule
  ],
  templateUrl: './shared-rdas-article-charts.component.html',
  styleUrl: './shared-rdas-article-charts.component.scss',
})
export class SharedRdasArticleChartsComponent {
  @Input() filters!: FilterCategory[];
  filterTypes: Signal<string[]> = computed(() => this.filters!.map(filter => filter.label));
  selectedFilterLabel: WritableSignal<string> = signal('');
  selectedFilter: Signal<FilterCategory> = computed(()=> this.filters?.filter(filter=> filter.label === this.selectedFilterLabel!())[0])

  filterControl: FormControl<string | null> = new FormControl<string | null>('');

  constructor() {

  }

  ngOnInit() {
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
