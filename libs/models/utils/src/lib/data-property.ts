import { InjectionToken } from '@angular/core'
import { Params } from '@angular/router'

export class DataProperty {
  id?: number
  field!: string
  label?: string
  value!: string
  url?: string
  tooltip?: string
  sortable?: boolean
  sorted?: 'asc' | 'desc'
  internalLink?: string[]
  externalLink?: string
  visible?: boolean
  width?: number
  customComponent?: InjectionToken<string>
  queryParams?: Params
  description?: string
  displayType?: 'string' | 'number' | 'externalLink' | 'internalLink' | 'date'

  constructor(data?: Partial<DataProperty>) {
    Object.assign(this, data)
    if (!this.field) {
      if (data) {
        this.field = <string>data['label']
      }
    }
  }
}
