import { ListRange, SelectionModel } from '@angular/cdk/collections';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnChanges,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Filter, FilterCategory } from '@ncats-frontend-library/models/utils';
import { HighlightPipe } from '@ncats-frontend-library/shared/utils/highlight-pipe';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'ncats-frontend-library-shared-utils-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ScrollingModule,
    HighlightPipe,
    MatButtonModule,
    MatIconModule,
    MatDivider,
  ],
  templateUrl: './shared-utils-filter-panel.component.html',
  styleUrls: ['./shared-utils-filter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUtilsFilterPanelComponent implements OnInit, OnChanges {
  destroyRef = inject(DestroyRef);
  searchInput = viewChild<MatInput>(MatInput);
  cdkViewport = viewChild<CdkVirtualScrollViewport>(CdkVirtualScrollViewport);
  filter = input<FilterCategory>({} as FilterCategory);
  filterSelectionChange = output<{ label: string; values: string[] }[]>();
  filterChange = output<{
    label: string;
    term?: string;
    page?: number;
  }>();

  searchCtl: FormControl = new FormControl<string>('');
  filterSelection = new SelectionModel<string>(true, []);
  loading = false;

  range!: ListRange;

  fullList = input(false);

  ngOnInit() {
    this.filterSelection.changed.subscribe(() => {
      this.filterSelectionChange.emit([
        { label: this.filter().label, values: this.filterSelection.selected },
      ]);
    });

    this.searchCtl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(400),
        distinctUntilChanged(),
        map((term: string) => {
          this.filterChange.emit({
            label: this.filter().label,
            term: term,
          });
        }),
      )
      .subscribe();

    this.searchCtl.setValue(this.filter()?.query, { emitEvent: false });

    if (this.searchInput && this.filter().query) {
      this.searchInput()!.focus();
    }

    this.cdkViewport()!
      .renderedRangeStream.pipe(
        takeUntilDestroyed(this.destroyRef),
        map((range: ListRange) => {
          this.range = range;
        }),
      )
      .subscribe();
  }

  ngOnChanges() {
    this.filterSelection.select(
      ...this.filter()
        .values.filter((val) => val.selected)
        .map((val) => val.term),
    );
  }

  scrollDetected() {
    if (this.filter().page != 1) {
      if (this.range.end < this.filter().values.length / this.filter()!.page) {
        this.cdkViewport()!.scrollToIndex((this.filter()!.page - 1) * 200);
      }
    }
  }

  loadMore() {
    this.loading = true;
    this.filterChange.emit({
      label: this.filter()!.label,
      page: this.filter()!.page,
    });
  }
  clearSearch() {
    this.searchCtl.reset();
  }

  _filterField(index: number, filter: Filter) {
    return filter.value;
  }
}
