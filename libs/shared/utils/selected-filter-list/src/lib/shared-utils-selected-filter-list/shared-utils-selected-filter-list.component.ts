import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  output,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ncats-frontend-library-shared-utils-selected-filter-list',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatButtonModule, MatIconModule],
  templateUrl: './shared-utils-selected-filter-list.component.html',
  styleUrls: ['./shared-utils-selected-filter-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SharedUtilsSelectedFilterListComponent {
  /**
   * list of selected facets
   */
  filters = input<Map<string, string[]>>();
  filterChange = output<{ label: string; values: string[] }[]>();

  /**
   * remove a specific facet and all selected fields
   * @param family
   */
  removeFilterFamily(family: string): void {
    this.filters()?.set(family, []);
    this.filterChange.emit(this._flattenMap());
  }

  /**
   * remove single field from a facet
   * @param label
   * @param value
   */
  removeField(label: string, value: string): void {
    const vals = this.filters()
      ?.get(label)
      ?.filter((val) => val !== value);
    if (vals && vals.length) {
      this.filters()?.set(label, vals);
    } else {
      this.removeFilterFamily(label);
    }
    this.filterChange.emit(this._flattenMap());
  }

  /**
   * clear all queries/facets
   */
  removeAll(): void {
    this.filters()?.clear();
    this.filterChange.emit(this._flattenMap());
  }

  _flattenMap(): { label: string; values: string[] }[] {
    const ret: { label: string; values: string[] }[] = [];
    [...this.filters()!.keys()].forEach((key) => {
      let valuesArr = this.filters()?.get(key);
      if (!valuesArr) {
        valuesArr = [];
      }
      ret.push({ label: key, values: valuesArr });
    });
    return ret;
  }
}
