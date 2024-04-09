import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import { Tool } from "ifx";
import { FetchToolActions, LoadToolsActions } from "./ifx-tools.actions";

import * as IfxToolsActions from './ifx-tools.actions';

export const IFX_TOOLS_FEATURE_KEY = 'ifxTools';

export interface IfxToolsState extends EntityState<Tool> {
  selectedId?: string | number; // which IfxTools record has been selected
  loaded: boolean; // has the IfxTools list been loaded
  error?: string | null; // last known error (if any)
 // tools?: Tool[],
  audienceList?: string[],
  categoryList?: string[]
}

export interface IfxToolsPartialState {
  readonly [IFX_TOOLS_FEATURE_KEY]: IfxToolsState;
}

export const ifxToolsAdapter: EntityAdapter<Tool> =
  createEntityAdapter<Tool>({
    selectId: (tool) => tool.toolName?.toLocaleLowerCase().replace(/ /g, '-')
  });

export const initialIfxToolsState: IfxToolsState =
  ifxToolsAdapter.getInitialState({
    // set initial required properties
    loaded: false,
  });

const reducer = createReducer(
  initialIfxToolsState,
  on(LoadToolsActions.loadToolsSuccess, (state, {tools, audienceList, categoryList}) => (
    ifxToolsAdapter.setAll(tools, {
    ...state,
    audienceList: audienceList,
    categoryList: categoryList,
    loaded: true,
    error: null,
  } ))
  ),

  on(FetchToolActions.setSelectedID, (state, {id}) => ({
        ...state,
        selectedId: id
      }
    )),

  on(LoadToolsActions.loadToolsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);

export function ifxToolsReducer(
  state: IfxToolsState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
