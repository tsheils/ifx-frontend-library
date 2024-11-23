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

export const FetchTrialsListActions = createActionGroup({
  source: 'Fetch Trials List',
  events: {
    FetchTrialsList: props<{
      top: number;
      skip: number;
    }>(),
    FetchTrialsListSuccess: props<{ trials: ClinicalTrial[] }>(),
    FetchTrialsListFailure: props<{ error: string }>(),
  },
});
