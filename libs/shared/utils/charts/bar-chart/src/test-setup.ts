// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
import 'jest-preset-angular/setup-jest';
import { FilterCategory } from "@ncats-frontend-library/models/utils";

export const BARDATA: FilterCategory = new FilterCategory({
  field: "",
  label: 'Clinical Trials by Type',
  parent: 'trials',
  filterable: true,
  page: 1,
  values: [
    {
      term: 'Interventional',
      label: 'StudyType',
      count: 45,
      selected: false
    },
    {
      term: 'Observational',
      label: 'StudyType',
      count: 30,
      selected: false
    }
  ]
})
