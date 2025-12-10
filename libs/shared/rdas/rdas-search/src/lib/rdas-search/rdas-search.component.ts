import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  viewChild,
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
import { Disease } from 'rdas-models';
import { HighlightPipe } from 'highlight-pipe';
import {
  DiseaseSelectors,
  FetchDiseaseActions,
  SearchDiseasesActions,
} from 'disease-store';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'lib-rdas-search',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdasSearchComponent implements OnInit {
  private readonly diseaseStore = inject(Store);
  destroyRef = inject(DestroyRef);
  autocomplete = viewChild(MatAutocompleteTrigger);
  options = this.diseaseStore.selectSignal(
    DiseaseSelectors.searchDiseasesEntities
  );
  searchFormCtl: FormControl = new FormControl();

  diseaseSelect = output<Disease>();
  diseaseSearch = output<string>();

  ngOnInit(): void {
    this.searchFormCtl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((term) => {
        if (term && term.length) {
          this.diseaseStore.dispatch(
            SearchDiseasesActions.searchDiseases({ term: term.trim() })
          );
        }
      });
  }

  selectDisease(event: MatAutocompleteSelectedEvent) {
    this.diseaseSelect.emit(event.option.value as Disease);
    this.searchFormCtl.reset();
    this.diseaseStore.dispatch(FetchDiseaseActions.clearStaticDiseaseFilters());
    this.diseaseStore.dispatch(FetchDiseaseActions.clearDisease());
  }

  searchString() {
    this.autocomplete()?.closePanel();
    const searchVal: string = this.searchFormCtl.value.name
      ? this.searchFormCtl.value.name
      : this.searchFormCtl.value;
    this.diseaseSearch.emit(searchVal);
  }

  displayFn(option: { name: string; id: string }): string {
    return option && option.name ? option.name : '';
  }
}
