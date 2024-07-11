import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Tool } from 'ifx';

export const LoadToolsActions = createActionGroup({
  source: 'Load Tools',
  events: {
    loadTools: emptyProps(),
    loadToolsSuccess: props<{
      tools: Tool[];
      audienceList: string[];
      categoryList: string[];
    }>(),
    loadToolsFailure: props<{ error: string }>(),
  },
});

export const FetchToolActions = createActionGroup({
  source: 'Fetch Tool',
  events: {
    setSelectedID: props<{ id: string }>(),
    fetchTool: props<{ tool: string }>(),
    fetchToolSuccess: props<{ tool: Tool }>(),
    fetchToolFailure: props<{ error: string }>(),
  },
});
