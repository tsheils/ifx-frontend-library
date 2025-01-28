import { CoreProject } from '@ncats-frontend-library/models/rdas'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity'
import { createReducer, on, Action } from '@ngrx/store'
import { FetchProjectActions, FetchProjectsListActions } from './grants.actions'

import * as ProjectsActions from './grants.actions'

export const PROJECTS_FEATURE_KEY = 'projects'

export interface ProjectsState extends EntityState<CoreProject> {
  selectedId?: string | number // which Projects record has been selected
  loaded: boolean // has the Projects list been loaded
  error?: string | null // last known error (if any)
  project?: CoreProject
  projects?: CoreProject[]
  allProjectsCount: number
  projectsCount: number
}

export interface ProjectsPartialState {
  readonly [PROJECTS_FEATURE_KEY]: ProjectsState
}

export const projectsAdapter: EntityAdapter<CoreProject> =
  createEntityAdapter<CoreProject>({
    selectId: (project) => project.core_project_num,
  })

export const initialProjectsState: ProjectsState =
  projectsAdapter.getInitialState({
    // set initial required properties
    loaded: false,
    allProjectsCount: 0,
    projectsCount: 0,
  })

const reducer = createReducer(
  initialProjectsState,
  on(
    FetchProjectsListActions.fetchProjectsListSuccess,
    (state, { projects, allProjectsCount, projectsCount }) =>
      projectsAdapter.setAll(projects, {
        ...state,
        loaded: true,
        allProjectsCount: allProjectsCount || 0,
        projectsCount: projectsCount || 0,
      })
  ),

  on(FetchProjectActions.fetchProjectSuccess, (state, { project }) =>
    projectsAdapter.setOne(project, {
      ...state,
      selectedId: project.core_project_num,
      loaded: true,
    })
  ),
  on(
    FetchProjectsListActions.fetchProjectsListFailure,
    FetchProjectActions.fetchProjectFailure,
    (state, { error }) => ({
      ...state,
      error,
    })
  )
)

export function projectsReducer(
  state: ProjectsState | undefined,
  action: Action
) {
  return reducer(state, action)
}
