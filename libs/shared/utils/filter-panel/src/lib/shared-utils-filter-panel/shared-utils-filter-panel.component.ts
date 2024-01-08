import { ListRange, SelectionModel } from '@angular/cdk/collections';
import {
  CdkVirtualScrollViewport,
  ScrollDispatcher,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  HostListener,
  Inject,
  inject,
  InjectionToken,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FilterCategory } from '@ncats-frontend-library/models/utils';
import { HighlightPipe } from '@ncats-frontend-library/shared/utils/highlight-pipe';
import { LoadingSpinnerComponent } from '@ncats-frontend-library/shared/utils/loading-spinner';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';

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
  ],
  templateUrl: './shared-utils-filter-panel.component.html',
  styleUrls: ['./shared-utils-filter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUtilsFilterPanelComponent implements OnInit, OnChanges {
  destroyRef = inject(DestroyRef);
  @ViewChild(MatInput, { read: MatInput, static: true }) searchInput!: MatInput;
  @ViewChild(CdkVirtualScrollViewport, {
    read: CdkVirtualScrollViewport,
    static: true,
  })
  cdkViewport!: CdkVirtualScrollViewport;

  /**
   * initialize a private variable _data, it's a BehaviorSubject
   *
   */
  @Input() filter!: FilterCategory;

  @Output() filterSelectionChange: EventEmitter<
    { label: string; values: string[] }[]
  > = new EventEmitter<{ label: string; values: string[] }[]>();

  @Output() filterChange: EventEmitter<{
    label: string;
    term?: string;
    page?: number;
  }> = new EventEmitter<{ label: string; term?: string; page?: number }>();

  searchCtl: FormControl = new FormControl<string>('');

  /**
   * selection model to track selected filters
   * @type {SelectionModel<string>}
   */
  filterSelection = new SelectionModel<string>(true, []);

  displayColumns = ['select', 'term', 'count'];

  /**
   * flag to show or hide the spinner for loading all facet options
   */
  loading = false;

  range!: ListRange;

  /**
   * add route and change tracking dependencies
   * @param changeRef
   */
  constructor(private changeRef: ChangeDetectorRef) {}

  /**
   * retrieve and set facet values, subscribe to changes
   */
  ngOnInit() {
    this.filterSelection.changed.subscribe(() => {
      this.filterSelectionChange.next([
        { label: this.filter.label, values: this.filterSelection.selected },
      ]);
    });

    this.searchCtl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(400),
        distinctUntilChanged(),
        map((term) => {
          this.filterChange.next({
            label: this.filter.label,
            term: term ? term : ' ',
          });
          this.loading = true;
        })
      )
      .subscribe();

    this.searchCtl.setValue(this.filter.query, { emitEvent: false });

    if (this.searchInput && this.filter.query) {
      this.searchInput.focus();
    }

    this.cdkViewport.renderedRangeStream
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((range: ListRange) => {
          this.range = range;
        })
      )
      .subscribe();
  }

  ngOnChanges() {
    this.filterSelection.select(
      ...this.filter.values.filter((val) => val.selected).map((val) => val.term)
    );
  }

  scrollDetected() {
    if (this.filter.page != 1) {
      if (this.range.end < this.filter.values.length / this.filter.page) {
        this.cdkViewport.scrollToIndex((this.filter.page - 1) * 200);
      }
    }
  }

  loadMore() {
    this.loading = true;
    this.filterChange.next({
      label: this.filter.label,
      page: this.filter.page,
    });
  }
  clearSearch() {
    this.searchCtl.reset();
  }
}
