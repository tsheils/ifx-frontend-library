import { Component, computed, inject, Signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { Filter, FilterCategory } from "@ncats-frontend-library/models/utils";
import { SharedUtilsListFilterRowComponent } from "@ncats-frontend-library/shared/utils/list-filter-row";
import { Store } from "@ngrx/store";
import { ResolverForm } from "ifx";
import { ResolverDataViewerComponent } from "resolver-data-viewer";
import { ResolveQueryActions, ResolverSelectors } from "resolver-store";

@Component({
  selector: 'lib-resolver-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    SharedUtilsListFilterRowComponent,
    MatRadioModule,
    MatButtonModule,
    ResolverDataViewerComponent
  ],
  templateUrl: './resolver-main.component.html',
  styleUrl: './resolver-main.component.scss',
})
export class ResolverMainComponent {
  private readonly store = inject(Store);
  resolveCtrl = new FormControl<string>('LARGEST');
  inputCtrl = new FormControl();
  options: Signal<Filter[] | undefined> = this.store.selectSignal(ResolverSelectors.selectResolverOptions);
  optionCategories: Signal<FilterCategory[]> = computed(() => {
      const retMap: Map<string, FilterCategory> = new Map<string, FilterCategory>();
      this.options()?.forEach((opt: Filter) => {
        if (opt.tags) {
          opt.tags.forEach((tag: string) => {
            const parentArr: FilterCategory | undefined = retMap.get(tag);
            if (parentArr) {
              parentArr.values.push(opt);
              retMap.set(tag, parentArr);
            } else {
              retMap.set(tag, new FilterCategory({parent: tag, values:[opt]}));
            }
          });
        }
      })
      return Array.from(retMap.values());
    }
  )
  filterOptionsList!: { [key: string]: Filter[] };
  resolvedData = this.store.selectSignal(ResolverSelectors.selectAllResolver)


filterOptions(event: { [key: string]: Filter[] }) {
  this.filterOptionsList = event
}

resolve() {
    console.log(this.inputCtrl.value)
  const formData: ResolverForm = new ResolverForm({
    structure: this.inputCtrl.value,
    format: 'json',
    apikey: '',
    standardize: this.resolveCtrl.value || "LARGEST"
  })
  let URL = ''
  Object.values(this.filterOptionsList).forEach((category:Filter[]) => {
    console.log(category);
    category.forEach((filter: Filter) => {
      if (filter.value) {
        URL = URL + '/' + filter.value
      }
    })
  })
 this.store.dispatch(ResolveQueryActions.resolveQuery({urlStub: URL, form: formData}))
}
}
