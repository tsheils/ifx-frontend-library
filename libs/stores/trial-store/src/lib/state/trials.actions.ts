import { ClinicalTrial } from 'rdas-models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

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

export const FetchTrialCountsActions = createActionGroup({
  source: 'Fetch Trial Counts',
  events: {
    fetchTrialCounts: props<{
      options?: { [key: string]: string };
    }>(),
    fetchTrialCountsSuccess: emptyProps(),
    fetchTrialCountsFailure: props<{ error: string }>(),
  },
});

export const FetchTrialsListActions = createActionGroup({
  source: 'Fetch Trials List',
  events: {
    FetchTrialsList: props<{
      top: number;
      skip: number;
    }>(),
    FetchTrialsListSuccess: props<{
      clinicalTrials: ClinicalTrial[];
      allClinicalTrialsCount?: number;
      clinicalTrialsCount?: number;
    }>(),
    FetchTrialsListFailure: props<{ error: string }>(),
  },
});
