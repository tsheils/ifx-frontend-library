export interface FilterResponse {
  data: {
    filters: Filter[];
    label: string;
  };
}

export class Filter {
  term!: string | number | boolean;
  label!: string;
  value!: string | number | boolean;
  count = 0;
  filteredCount?: number;
  selected = false;
  description?: string;
  tags?: string[];
  format?: string;
  _filteredCount?: { aggregate: { count: { nodes: number } } };

  constructor(obj: Partial<Filter>) {
    Object.assign(this, obj);
    if (obj._filteredCount) {
      this.filteredCount = obj._filteredCount.aggregate.count.nodes;
    }
  }
}

export class FilterCategory {
  label!: string;
  field!: string;
  query?: string | number | boolean;
  parent?: string;
  formType = 'select';
  filterable = true;
  page = 1;
  values!: Filter[];

  constructor(obj: Partial<FilterCategory>) {
    Object.assign(this, obj);
    if (obj.values && obj.values.length) {
      this.values = obj.values
        .map((val) => {
          if (!val.label) {
            val.label = this.label;
          }
          return new Filter(val);
        })
        .sort((a, b) => b.count - a.count);
    }

    if (!obj.label) {
      if (obj.parent) {
        this.label = obj.parent;
      }
    }
    if (!obj.field) {
      if (obj.parent) {
        this.field = obj.parent;
      }
    }
  }
}

/*
export function parseFilterResponse(
  res: FilterResponse,
  currentFilter?: FilterCategory,
): FilterCategory {
  let filterCategory: FilterCategory = {} as FilterCategory;
 // if (Object.keys(res).length) {
   // const retMap: Map<string, Filter> = new Map<string, Filter>();
  //  Object.keys(res).forEach((key: string) => {
      /!*const selectedFiltersData: { selectedFilters: Filter[] } = res[
        key as keyof FilterResponse
      ].data as { selectedFilters: Filter[] };
      if (selectedFiltersData) {
        //selected/checked filters always go on top
        selectedFiltersData.selectedFilters?.forEach((obj: Partial<Filter>) => {
          retMap.set(
            <string>obj.term,
            new Filter({
              ...obj,
              selected: true,
            }),
          );
        });
      }*!/
      //search term
      // }
 /!*     const searchFiltersData: { searchFilters: Filter[] } = res[key].data as {
        searchFilters: Filter[];
      };
      if (searchFiltersData) {
        searchFiltersData.searchFilters.forEach((obj: Partial<Filter>) => {
          if (!retMap.has(<string>obj.term)) {
            retMap.set(
              <string>obj.term,
              new Filter({
                ...obj,
              }),
            );
          }
        });
        //current values (just for pagination)
        currentFilter?.values.forEach((filter) => {
          if (!retMap.has(<string>filter.term)) {
            retMap.set(<string>filter.term, filter);
          }
        });
      }*!/
      //everything else
/!*      const allFiltersData: { allFilters: Filter[] } = res[key].data as {
        allFilters: Filter[];
      };
      if (allFiltersData) {*!/
       /!* allFiltersData.allFilters.forEach((obj: Partial<Filter>) => {
          if (!retMap.has(<string>obj.term)) {
            retMap.set(
              <string>obj.term,
              new Filter({
                ...obj,
              }),
            );
          }
        });*!/
         filterCategory = new FilterCategory({
          label: res.data.label,
          values: res.data.filters.sort(
            (a, b) => Number(b.selected) - Number(a.selected),
          ),
          page: currentFilter?.page || 0,
          query: currentFilter?.query,
        });

      }
     /!* filterCategory.values = [...retMap.values()].sort(
        (a, b) => Number(b.selected) - Number(a.selected),
      );*!/
     // filters.push(filterCategory as FilterCategory);
    });
  }
  console.log(filterCategory);
  return filterCategory;
}
*/
