export class Filter {
  term!: string;
  label?: string;
  count = 0;
  selected = false;

  constructor(obj: Partial<Filter>) {
    Object.assign(this, obj);
  }
}

export class FilterCategory {
  label!: string;
  query?: string;
  parent?: string;
  filterable?: true;
  page = 1;
  values!: Filter[];

  constructor(obj: Partial<FilterCategory>) {
    if (obj.page) {
      this.page = obj.page;
    }

    if (obj.query) {
      this.query = obj.query;
    }

    if (obj.parent) {
      this.parent = obj.parent;
    }

    if (obj.label) {
      this.label = obj.label;
    }
    if (obj.values && obj.values.length) {
      this.values = obj.values.map((val) => new Filter(val));
    }
  }
}
