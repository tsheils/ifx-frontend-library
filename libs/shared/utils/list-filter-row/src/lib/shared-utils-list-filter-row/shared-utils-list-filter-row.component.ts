import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { FilterCategory } from "@ncats-frontend-library/models/utils";

@Component({
  selector: 'lib-shared-utils-list-filter-row',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './shared-utils-list-filter-row.component.html',
  styleUrl: './shared-utils-list-filter-row.component.scss',
})
export class SharedUtilsListFilterRowComponent implements OnInit {
  @Input() filters!: FilterCategory[] | undefined;
  filterFormControls!: FormGroup;

  @Output() filterChange: EventEmitter<{ [key: string]: unknown }> = new EventEmitter<{[key: string]: unknown}>();

  ngOnInit() {
    if (this.filters && this.filters.length) {
      const controls: {[key:string]: FormControl} = {};
      this.filters = this.filters.filter((f: FilterCategory) => f.filterable);
        if (this.filters) {
          this.filters.forEach((filter: FilterCategory) => {
            const selected = filter.values.filter(val => val.selected).map(term => term.term);
            controls[this.getFilterName(filter)] = new FormControl(selected);
          })
          this.filterFormControls = new FormGroup(controls)
      }
    }

    this.filterFormControls.valueChanges.subscribe(() => {
      this.filterChange.emit(this.filterFormControls.value);
    })
  }

  getFilterName(filter: FilterCategory): string {
    return filter.values.length ? filter.values[0].label : 'Filter';
  }
}
