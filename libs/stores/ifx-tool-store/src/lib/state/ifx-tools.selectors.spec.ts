import { Tool } from "ifx";
import { TOOLSTATE } from "../../test-setup";
import { IfxToolsState } from "./ifx-tools.reducer";
import * as IfxToolsSelectors from './ifx-tools.selectors';

describe('IfxTools Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  let state: IfxToolsState;

  beforeEach(() => {
    state = TOOLSTATE as unknown as IfxToolsState
  });

  describe('IfxTools Selectors', () => {
    it('selectAllIfxTools() should return the list of IfxTools', () => {
      const results = IfxToolsSelectors.selectAllIfxTools(state);
      const selId = results[0].toolName;

      expect(results.length).toBe(31);
      expect(selId).toBe('qHTS Data Browser');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = IfxToolsSelectors.selectEntity(state) as Tool;
      const selId = result.toolUrl;

      expect(selId).toBe('qhts-data-browser');
    });

    it('selectIfxToolsLoaded() should return the current "loaded" status', () => {
      const result = IfxToolsSelectors.selectIfxToolsLoaded(state);

      expect(result).toBe(true);
    });

    it('selectIfxToolsError() should return the current "error" state', () => {
      const result = IfxToolsSelectors.selectIfxToolsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
