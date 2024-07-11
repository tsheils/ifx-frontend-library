import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Tool } from 'ifx';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { TOOLSTATE } from '../../test-setup';
import { LoadToolsActions } from './ifx-tools.actions';
import * as IFXToolsEffects from './ifx-tools.effects';

describe('IfxToolsEffects', () => {
  let actions: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        IFXToolsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: LoadToolsActions.loadTools() });

      const expected = hot('-a-|', {
        a: LoadToolsActions.loadToolsSuccess({
          audienceList: TOOLSTATE.ifxTools.audienceList,
          categoryList: TOOLSTATE.ifxTools.categoryList,
          tools: [...Object.values(TOOLSTATE.ifxTools.entities)] as Tool[],
        }),
      });

      expect(expected).toEqual(expected);
    });
  });
});
