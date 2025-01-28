export class Filter {
  term!: string
  label!: string
  value!: string
  count = 0
  selected = false
  description?: string
  tags?: string[]
  format?: string

  constructor(obj: Partial<Filter>) {
    Object.assign(this, obj)
  }
}

export class FilterCategory {
  label!: string
  field!: string
  query?: string
  parent?: string
  filterable = true
  page = 1
  values!: Filter[]

  constructor(obj: Partial<FilterCategory>) {
    Object.assign(this, obj)

    if (obj.values && obj.values.length) {
      this.values = obj.values
        .map((val) => new Filter(val))
        .sort((a, b) => b.count - a.count)
    }

    if (!obj.label) {
      if (obj.parent) {
        this.label = obj.parent
      }
    }
    if (!obj.field) {
      if (obj.parent) {
        this.field = obj.parent
      }
    }
  }
}
