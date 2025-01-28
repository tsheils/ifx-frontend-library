import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
import { FilterCategory } from '@ncats-frontend-library/models/utils'

export const PIEFILTERS: FilterCategory = new FilterCategory({
  field: '',
  label: 'Clinical Trials by Type',
  parent: 'trials',
  filterable: true,
  page: 1,
  values: [
    {
      value: 'Interventional',
      term: 'Interventional',
      label: 'StudyType',
      count: 45,
      selected: false,
    },
    {
      value: 'Observational',
      term: 'Observational',
      label: 'StudyType',
      count: 30,
      selected: false,
    },
  ],
})
