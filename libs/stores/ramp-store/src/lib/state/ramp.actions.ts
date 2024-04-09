import { createAction, props } from '@ngrx/store';
import { RampEntity } from './ramp.models';

export const initRamp = createAction('[Ramp Page] Init');

export const loadRampSuccess = createAction(
  '[Ramp/API] Load Ramp Success',
  props<{ ramp: RampEntity[] }>(),
);

export const loadRampFailure = createAction(
  '[Ramp/API] Load Ramp Failure',
  props<{ error: any }>(),
);
