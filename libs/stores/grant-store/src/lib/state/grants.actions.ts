import { CoreProject } from "@ncats-frontend-library/models/rdas";
import { createAction, props } from '@ngrx/store';

export const initGrants = createAction('[Grants Page] Init');

export const loadGrants = createAction(
  '[Grants/API] Load Grants',
  props<{
    top: number
    skip: number
  }>()
);

export const loadGrantsSuccess = createAction(
  '[Grants/API] Load Grants Success',
  props<{ grants: CoreProject[] }>()
);

export const loadGrantsFailure = createAction(
  '[Grants/API] Load Grants Failure',
  props<{ error: string | null | undefined }>()
);

export const fetchGrant = createAction(
  '[Grants/API] fetch Grant',
  props<{
    core_project_num: string,
    options?: { [key: string]: string }
  }>()
);


export const fetchGrantSuccess = createAction(
  '[Grants/API] Fetch Grant Success',
  props<{ grant: CoreProject}>()
);

export const fetchGrantFailure = createAction(
  '[Grants/API] Fetch Grant Failure',
  props<{ error: string | null | undefined }>()
);
