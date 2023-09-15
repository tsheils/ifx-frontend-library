import { ClinicalTrial } from "@ncats-frontend-library/models/rdas";
import { createAction, props } from '@ngrx/store';

export const initTrials = createAction('[Trials Page] Init');

export const fetchTrial = createAction(
  '[Trials/API] fetch Trial',
  props<{
    NCTId?: string,
    options?: { [key: string]: string }
  }>()
);

export const fetchTrialSuccess = createAction(
  '[Trials/API] Fetch Trial Success',
  props<{ trial: ClinicalTrial }>()
);

export const fetchTrialFailure = createAction(
  '[Trials/API] Fetch Trial Failure',
  props<{ error: string | null | undefined }>()
);

export const loadTrials = createAction(
  '[Trials/API] Load Trials',
  props<{
    top: number
    skip: number
  }>()
);

export const loadTrialsSuccess = createAction(
  '[Trials/API] Load Trials Success',
  props<{ trials: ClinicalTrial[] }>()
);

export const loadTrialsFailure = createAction(
  '[Trials/API] Load Trials Failure',
  props<{ error: string | null | undefined }>()
);
