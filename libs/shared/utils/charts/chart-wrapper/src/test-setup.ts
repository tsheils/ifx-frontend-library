import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
import { FilterCategory } from 'utils-models';

export const PIEFILTERS: FilterCategory = new FilterCategory({
  field: '',
  label: 'Clinical Trials by Type',
  parent: 'trials',
  filterable: true,
  page: 1,
  values: [
    {
      term: 'Interventional',
      value: 'Interventional',
      label: 'StudyType',
      count: 45,
      selected: false,
    },
    {
      term: 'Observational',
      value: 'Observational',
      label: 'StudyType',
      count: 30,
      selected: false,
    },
  ],
});
