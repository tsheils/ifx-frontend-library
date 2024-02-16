import { createAction, props } from '@ngrx/store';
import { AdmeEntity } from './adme.models';

export const initAdme = createAction('[Adme Page] Init');

export const loadAdmeSuccess = createAction(
  '[Adme/API] Load Adme Success',
  props<{ adme: AdmeEntity[] }>(),
);

export const loadAdmeFailure = createAction(
  '[Adme/API] Load Adme Failure',
  props<{ error: any }>(),
);
