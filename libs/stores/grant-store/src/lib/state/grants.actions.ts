import { CoreProject } from '@ncats-frontend-library/models/rdas';
import { createActionGroup, props } from '@ngrx/store';

export const FetchGrantActions = createActionGroup({
  source: 'Fetch Grant',
  events: {
    fetchGrant: props<{
      core_project_num: string;
      options?: { [key: string]: string };
    }>(),
    fetchGrantSuccess: props<{ grant: CoreProject }>(),
    fetchGrantFailure: props<{ error: string }>(),
  },
});

export const LoadGrantsActions = createActionGroup({
  source: 'Load Grants',
  events: {
    loadGrants: props<{
      top: number;
      skip: number;
    }>(),
    loadGrantsSuccess: props<{ grants: CoreProject[] }>(),
    loadGrantsFailure: props<{ error: string }>(),
  },
});
