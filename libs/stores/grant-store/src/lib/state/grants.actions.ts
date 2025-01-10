import { CoreProject } from '@ncats-frontend-library/models/rdas';
import { createActionGroup, props } from '@ngrx/store';

export const FetchProjectActions = createActionGroup({
  source: 'Fetch Project',
  events: {
    fetchProject: props<{
      core_project_num: string;
      options?: { [key: string]: string };
    }>(),
    fetchProjectSuccess: props<{ project: CoreProject }>(),
    fetchProjectFailure: props<{ error: string }>(),
  },
});

export const FetchProjectsListActions = createActionGroup({
  source: 'Load Projects',
  events: {
    FetchProjectsList: props<{
      top: number;
      skip: number;
    }>(),
    FetchProjectsListSuccess: props<{
      projects: CoreProject[];
      projectsCount: number;
      allProjectsCount: number;
    }>(),
    FetchProjectsListFailure: props<{ error: string }>(),
  },
});
