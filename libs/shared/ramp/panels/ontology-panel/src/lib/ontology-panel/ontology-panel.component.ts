import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  input,
  OnInit,
  output,
  Output,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { FilterCategory } from '@ncats-frontend-library/models/utils';
import { SharedUtilsFilterPanelComponent } from '@ncats-frontend-library/shared/utils/filter-panel';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'lib-ontology-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltip,
    MatButton,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    SharedUtilsFilterPanelComponent,
  ],
  templateUrl: './ontology-panel.component.html',
  styleUrl: './ontology-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OntologyPanelComponent implements OnInit {
  @ViewChildren('filterPanel')
  filterPanels!: QueryList<SharedUtilsFilterPanelComponent>;
  fetchMetabolitesSearch = output<{ ontologies: string[] }>();
  downloadMetabolitesSearch = output<{ ontologies: string[] }>();
  ontologies = input<FilterCategory[]>();
  filteredOntologies = signal(this.ontologies());
  ontologyMap: Map<string, string[]> = new Map<string, string[]>();
  disableSearch = false;
  allOntoFilterCtrl: FormControl = new FormControl<string>('');
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.filteredOntologies.set(this.ontologies());

    this.allOntoFilterCtrl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(400),
        distinctUntilChanged(),
        map((term: string) => {
          const retOntologies: FilterCategory[] = [];
          this.ontologies()?.forEach((ontologyCategory) => {
            const values = ontologyCategory.values.filter((ontology) =>
              ontology.term
                .toLocaleLowerCase()
                .includes(<string>term.toLocaleLowerCase()),
            );
            retOntologies.push(
              new FilterCategory({
                ...ontologyCategory,
                values: values,
                query: term,
              }),
            );
          });
          this.filteredOntologies.set(retOntologies);
        }),
      )
      .subscribe();
  }

  setValues(values: { label: string; values: string[] }[]) {
    let sum = 0;
    values.forEach((onto) => {
      this.ontologyMap.set(onto.label, onto.values);
      [...this.ontologyMap.entries()].forEach(([key, value]) => {
        const category = this.ontologies()?.filter((fc) => fc.label === key)[0];
        if (category && category.values) {
          value.forEach((val) => {
            const filterVal = category.values.filter((f) => f.term === val)[0];
            sum += filterVal.count;
            this.disableSearch = sum > 10000;
          });
        }
      });
    });
  }

  filterChange(search: { label: string; term?: string; page?: number }) {
    if (!search.term || search.term === '') {
      this.filteredOntologies.set(this.ontologies());
    } else {
      const returnedOntologies: FilterCategory[] = [];
      this.ontologies()?.forEach((onto) => {
        if (onto.label === search.label) {
          const term = search.term as string;
          const values = onto.values.filter((val) =>
            val.term
              .toLocaleLowerCase()
              .includes(<string>term.toLocaleLowerCase()),
          );
          returnedOntologies.push(
            new FilterCategory({ ...onto, values: values, query: term }),
          );
        } else {
          returnedOntologies.push(onto);
        }
        this.filteredOntologies.set(returnedOntologies);
      });
    }
  }

  clearAll() {
    this.filterPanels.forEach((panel) => {
      panel.filterSelection.clear();
    });
  }

  fetchMetabolitesFile() {
    const searchArr: string[] = [...this.ontologyMap.values()].flat();
    const searchObj = { ontologies: searchArr };
    this.downloadMetabolitesSearch.emit(searchObj);
  }

  fetchMetabolites() {
    const searchArr: string[] = [...this.ontologyMap.values()].flat();
    const searchObj = { ontologies: searchArr };
    this.fetchMetabolitesSearch.emit(searchObj);
  }
}
