import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Disease } from '@ncats-frontend-library/models/rdas';
import { HighlightPipe } from '@ncats-frontend-library/shared/utils/highlight-pipe';
import {
  DiseaseSelectors,
  SearchDiseasesActions,
} from '@ncats-frontend-library/stores/disease-store';
import { Store } from '@ngrx/store';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'ncats-frontend-library-rdas-search',
  templateUrl: './rdas-search.component.html',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    HighlightPipe,
  ],
  styleUrls: ['./rdas-search.component.scss'],
  standalone: true,
})
export class RdasSearchComponent implements OnInit, OnDestroy {
  private readonly diseaseStore = inject(Store);
  destroyRef = inject(DestroyRef);
  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<boolean> = new Subject();
  searchFormCtl: FormControl = new FormControl();

  @Output()
  diseaseSelect: EventEmitter<Disease> = new EventEmitter<Disease>();
  @Output()
  diseaseSearch: EventEmitter<string> = new EventEmitter<string>();
  options: Disease[] = [];
  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;

  constructor(private changeRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.diseaseStore
      .select(DiseaseSelectors.searchDiseasesEntities)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((res) => {
          if (res && res.length) {
            this.options = res.map((disease) => new Disease(disease));
            this.changeRef.markForCheck();
          }
        }),
      )
      .subscribe();

    this.searchFormCtl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(200),
        distinctUntilChanged(),
      )
      .subscribe((term) => {
        if (term && term.length) {
          this.diseaseStore.dispatch(
            SearchDiseasesActions.searchDiseases({ term: term.trim() }),
          );
        }
      });
  }

  selectDisease(event: MatAutocompleteSelectedEvent) {
    this.diseaseSelect.next(event.option.value as Disease);
  }

  searchString() {
    this.autocomplete.closePanel();
    const searchVal: string = this.searchFormCtl.value.name
      ? this.searchFormCtl.value.name
      : this.searchFormCtl.value;
    this.diseaseSearch.next(searchVal);
  }

  displayFn(option: { name: string; id: string }): string {
    return option && option.name ? option.name : '';
  }

  /**
   * clean up on leaving component
   */
  ngOnDestroy() {
    this.diseaseStore.dispatch(SearchDiseasesActions.clearTypeahead());
    this.searchFormCtl.reset();
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
