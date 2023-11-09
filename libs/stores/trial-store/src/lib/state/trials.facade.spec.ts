import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClinicalTrial } from '@ncats-frontend-library/models/rdas';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nx/angular/testing';

import * as TrialsActions from './trials.actions';
import { TrialsEffects } from './trials.effects';
import { TrialsFacade } from './trials.facade';
import {
  TRIALS_FEATURE_KEY,
  TrialsState,
  trialsReducer,
} from './trials.reducer';

interface TestSchema {
  trials: TrialsState;
}

describe('TrialsFacade', () => {
  let facade: TrialsFacade;
  let store: Store<TestSchema>;
  const createTrialsEntity = (id: string, name = ''): ClinicalTrial =>
    new ClinicalTrial({
      NCTId: id,
      name: name || `name-${id}`,
    });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(TRIALS_FEATURE_KEY, trialsReducer),
          EffectsModule.forFeature([TrialsEffects]),
        ],
        providers: [TrialsFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(TrialsFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allTrials$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allTrials$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadTrialsSuccess` to manually update list
     */
    it('allTrials$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allTrials$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        TrialsActions.loadTrialsSuccess({
          trials: [createTrialsEntity('AAA'), createTrialsEntity('BBB')],
        })
      );

      list = await readFirst(facade.allTrials$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
