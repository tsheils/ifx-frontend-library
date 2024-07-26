import { ClinicalTrial } from '@ncats-frontend-library/models/rdas';
import { createActionGroup, props } from '@ngrx/store';

export const FetchTrialActions = createActionGroup({
  source: 'Fetch Trial',
  events: {
    fetchTrial: props<{
      NCTId?: string;
      options?: { [key: string]: string };
    }>(),
    fetchTrialSuccess: props<{ trial: ClinicalTrial }>(),
    fetchTrialFailure: props<{ error: string }>(),
  },
});

export const LoadTrialsActions = createActionGroup({
  source: 'Load Trials',
  events: {
    loadTrials: props<{
      top: number;
      skip: number;
    }>(),
    loadTrialsSuccess: props<{ trials: ClinicalTrial[] }>(),
    loadTrialsFailure: props<{ error: string }>(),
  },
});
