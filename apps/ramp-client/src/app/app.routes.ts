import { Route } from '@angular/router';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromRamp from './libs/stores/ramp-store/lib/src/state/ramp.reducer';
import { RampEffects } from './libs/stores/ramp-store/lib/src/state/ramp.effects';

export const appRoutes: Route[] = [
  {
    path: '',
    providers: [
      provideState(fromRamp.RAMP_FEATURE_KEY, fromRamp.rampReducer),
      provideEffects(RampEffects),
    ],
  },
];
