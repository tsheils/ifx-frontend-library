import { SelectionModel } from "@angular/cdk/collections";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChange,
  WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { HighlightPipe } from "@ncats-frontend-library/shared/utils/highlight-pipe";
import { LoadingSpinnerComponent } from "@ncats-frontend-library/shared/utils/loading-spinner";
import { BehaviorSubject, debounceTime, distinctUntilChanged, map } from "rxjs";

@Component({
  selector: 'ncats-frontend-library-shared-utils-filter-panel',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatFormFieldModule,
    MatCardModule, MatInputModule, ReactiveFormsModule, LoadingSpinnerComponent,
   ScrollingModule, HighlightPipe, MatButtonModule, MatIconModule],
  templateUrl: './shared-utils-filter-panel.component.html',
  styleUrls: ['./shared-utils-filter-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedUtilsFilterPanelComponent {

   destroyRef = inject(DestroyRef);

  /**
   * initialize a private variable _data, it's a BehaviorSubject
   *
   */
  protected _values = new BehaviorSubject<{ term: string, count: number}[]>([]);

  @Input() selectedValues!:Map<string, string[]>;

  /**
   * pushes changed data to {BehaviorSubject}
   */
  @Input()
  set values(value: { term: string, count: number}[]) {
    this._values.next(value);
  }

  /**
   * returns value of {BehaviorSubject}
   */
  get values(): { term: string, count: number}[] {
    return this._values.getValue();
  }

 // @Input() values!: { term: string, count: number}[];
  @Input() label!: string;

  @Output() filterChange: EventEmitter<{label: string, values: string[]}> =
    new EventEmitter<{label: string, values: string[]}>();

  @Output() searchFilterChange: EventEmitter<string> =
    new EventEmitter<string>();

  @Output() pageFilterChange: EventEmitter<number> =
    new EventEmitter<number>();

  searchCtl: FormControl = new FormControl<string>('');
  /**
   * data source of filters to display in the table
   * @type {MatTableDataSource<any>}
   */
  dataSource = new MatTableDataSource<any>([]);

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

  lastIndex = 0;
  currentPage = 1;
  pagesLoaded = [1];
  /**
   * add route and change tracking dependencies
   * @param _route
   * @param router
   * @param changeRef
   */
  constructor(private _route: ActivatedRoute,
              private router: Router,
              private changeRef: ChangeDetectorRef
  ) {}

  /**
   * retrieve and set facet values, subscribe to changes
   */
  ngAfterViewInit() {
    console.log("new filters");
    this.dataSource.data = this.values;

    this.filterSelection.changed.subscribe(change => {
      console.log(change);
      this.filterChange.next({label: this.label.toLocaleLowerCase(), values: this.filterSelection.selected})
    })



    this.searchCtl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(400),
        distinctUntilChanged(),
        map(term => {
          this.searchFilterChange.next(term)
          this.loading = true;
        })
      ).subscribe()
}

ngOnChanges(change: SimpleChange) {
    console.log(change)
  if(this.values.length > 0) {
    if(this.searchCtl.value){
      this.dataSource.data = [...this.values];
      this.currentPage = 1;
      this.pagesLoaded = [1];
    } else {
      this.dataSource.data = this.dataSource.data.concat(this.values);
    }
  }
  if(this.values.length > 0 && this.values.length < 100) {
   // console.log("last page?")
  }
  if(this.selectedValues.has(this.label.toLocaleLowerCase())){
    const values = this.selectedValues.get(this.label.toLocaleLowerCase())
    if(values) {
      console.log(values);
      this.filterSelection.setSelection(...values);
      console.log(this.filterSelection.selected);
      this.changeRef.markForCheck();
      console.log(this.filterSelection.selected);
    }
  }
  this.loading = false;
}

  scrollDetected(index: number ){
    if(index === this.currentPage * 90 && !this.pagesLoaded.includes(this.currentPage+1)) {
      this.currentPage = this.currentPage + 1
      this.loading = true;
      this.pagesLoaded.push(this.currentPage);
      this.pageFilterChange.next(this.currentPage)
    } else {
      this.loading = false;
      this.lastIndex = index;
    }
  }

  clearSearch() {
    this.searchCtl.reset();
    this.dataSource.data = [];
  }
}
