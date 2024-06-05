import { SelectionModel } from "@angular/cdk/collections";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
  Signal,
  ViewChild,
  ViewEncapsulation,
  WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { Filter, FilterCategory } from "@ncats-frontend-library/models/utils";
import { HighlightPipe } from "@ncats-frontend-library/shared/utils/highlight-pipe";
import { SharedUtilsListFilterRowComponent } from "@ncats-frontend-library/shared/utils/list-filter-row";
import { Store } from "@ngrx/store";
import { ResolverForm } from "ifx";
import { ResolverDataViewerComponent } from "resolver-data-viewer";
import { LoadResolverOptionsActions, ResolveQueryActions, ResolverSelectors } from "resolver-store";
import { debounceTime, distinctUntilChanged } from "rxjs";

@Component({
  selector: "lib-resolver-main",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    SharedUtilsListFilterRowComponent,
    MatRadioModule,
    MatButtonModule,
    ResolverDataViewerComponent,
    HighlightPipe
  ],
  templateUrl: "./resolver-main.component.html",
  styleUrl: "./resolver-main.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ResolverMainComponent implements OnInit {
  private readonly store = inject(Store);
  private router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  optsList = this.store.selectSignal(ResolverSelectors.selectResolverOptions);
  resolvedData = this.store.selectSignal(ResolverSelectors.selectAllResolver);

  optionCategories: Signal<FilterCategory[]> = computed(() => this._mapFilterCategoriesFromArray(this.optsList()));
  filteredSearchOptions: WritableSignal<FilterCategory[]> = signal(this.optionCategories());
  selectedFilters: WritableSignal<{ [key: string]: Filter[] }> = signal(this._mapFilterArrayToObject(this.optsList()?.filter((opt:Filter) => opt.selected)));

  resolveCtrl = new FormControl<string>("LARGEST");
  inputCtrl = new FormControl();
  filterSearchCtrl = new FormControl();
  subscriptionSelection = new SelectionModel<Filter>(true, this.optsList()?.filter((opt:Filter) => opt.selected));

  ngOnInit() {
    if (this.route.snapshot && this.route.snapshot.queryParams) {
      const params = this.route.snapshot.queryParamMap;
      const optsString: string = <string>params.get("options");
      if (optsString) {
        const optsArr: string[] = optsString.split(";");
        this.store.dispatch(LoadResolverOptionsActions.setPreviousFilters({ filters: optsArr }));
      }
      this.resolveCtrl.setValue(params.get("standardize"));
      this.inputCtrl.setValue(params.get("params"));
    }

    this.filterSearchCtrl.valueChanges.subscribe(() => this.searchFilters());

    this.subscriptionSelection.changed
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(100),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.selectedFilters.set(this._mapFilterArrayToObject(this.subscriptionSelection.selected));
      });
  }

  resolve() {
    const formData: ResolverForm = new ResolverForm({
      structure: this.inputCtrl.value,
      format: "json",
      standardize: this.resolveCtrl.value || "LARGEST"
    });
    let URL = "";

    this.subscriptionSelection.selected.forEach((filter: Filter) => {
      if (filter.value) {
        URL = URL + "/" + filter.value;
      }
    });


    localStorage.removeItem("previouslyUsedOptions");
    localStorage.setItem("previouslyUsedOptions", JSON.stringify(this.subscriptionSelection.selected.map(fil => fil.value)));
    this.store.dispatch(ResolveQueryActions.resolveQuery({ urlStub: URL, form: formData }));
    // ?params=aspirin&options=inchikey;molExactMass;lychi1;lychi3;molExactMassParent;molFormParent;img&standardize=CHARGE_NORMALIZE
    this.router.navigate(
      [],
      {
        queryParams: {
          "params": this.inputCtrl.value,
          "options": this.subscriptionSelection.selected.map(fil => fil.value).join(";"),
          "standardize": this.resolveCtrl.value
        },
        queryParamsHandling: "merge"
      }
    );
  }

  searchFilters() {
    if(this.filterSearchCtrl.value) {
      const searchCategories = this.optionCategories().flat().map((category) => category.values).flat();
      const retArr = searchCategories.filter((filter) => {
        if (filter.term.includes(this.filterSearchCtrl.value) || filter.description?.includes(this.filterSearchCtrl.value)) {
          return filter;
        } else {
          return;
        }
      });
      this.filteredSearchOptions.set(this._mapFilterCategoriesFromArray(retArr))
    } else {
      this.filteredSearchOptions.set(this.optionCategories())
    }
  }

  removeChip(filter: Filter) {
    this.subscriptionSelection.deselect(filter);
  }

  clearParams() {
    this.subscriptionSelection.clear();
  }

  searchDisabled() {
    return !this.inputCtrl.value || this.subscriptionSelection.isEmpty();// || this.filterOptionsList())
  }

  _mapFilterCategoriesFromArray(filterArr: Filter[] | undefined): FilterCategory[] {
    if (filterArr && filterArr.length) {
      const retMap: Map<string, FilterCategory> = new Map<string, FilterCategory>();
      filterArr.forEach((opt: Filter) => {
        if (opt.tags) {
          opt.tags.forEach((tag: string) => {
            const parentArr: FilterCategory | undefined = retMap.get(tag);
            if (parentArr) {
              parentArr.values.push(opt);
              retMap.set(tag, parentArr);
            } else {
              retMap.set(tag, new FilterCategory({ parent: tag, values: [opt] }));
            }
          });
        }
      });
      return Array.from(retMap.values());
    } else return []
  }

  _mapFilterArrayToObject(filters: Filter[] | undefined) {
    const tempObj: { [key: string]: Filter[] } = {};
    if(filters) {
      filters.forEach((filter: Filter) => {
        if (filter.tags) {
          const field = filter.tags[0];
          if (tempObj[field] && tempObj[field].length) {
            tempObj[field].push(filter);
            tempObj[field] = tempObj[field].sort((a,b) => a.term.localeCompare(b.term))
          } else {
            tempObj[field] = [filter];
          }
        }
      });
    }
    return tempObj;
  }
}
