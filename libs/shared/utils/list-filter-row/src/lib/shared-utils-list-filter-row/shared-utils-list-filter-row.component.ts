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
  @Input() filters!: FilterCategory[];
  filterFormControls: FormGroup = new FormGroup<any>({});

  @Output() filterChange: EventEmitter<{ [key: string]: any }> = new EventEmitter<{[key: string]: any}>();

  ngOnInit() {
    this.filters = this.filters.filter((f: FilterCategory) => f.filterable);
      this.filters.forEach((filter: FilterCategory)=> {
      const selected = filter.values.filter(val => val.selected).map(term => term.term);
      this.filterFormControls.setControl(filter.values[0].label!, new FormControl(selected))
    })

    this.filterFormControls.valueChanges.subscribe(() => {
      this.filterChange.emit(this.filterFormControls.value);
    })
  }

}
