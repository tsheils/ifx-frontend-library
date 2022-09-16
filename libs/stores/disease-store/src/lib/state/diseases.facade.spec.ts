import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { NxModule } from '@nrwl/angular';
import { readFirst } from '@nrwl/angular/testing';

import * as DiseasesActions from './diseases.actions';
import { DiseasesEffects } from './diseases.effects';
import { DiseasesFacade } from './diseases.facade';
import { DiseasesEntity } from './diseases.models';
import {
  DISEASES_FEATURE_KEY,
  DiseasesState,
  initialDiseasesState,
  diseasesReducer,
} from './diseases.reducer';
import * as DiseasesSelectors from './diseases.selectors';

interface TestSchema {
  diseases: DiseasesState;
}

describe('DiseasesFacade', () => {
  let facade: DiseasesFacade;
  let store: Store<TestSchema>;
  const createDiseasesEntity = (id: string, name = ''): DiseasesEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(DISEASES_FEATURE_KEY, diseasesReducer),
          EffectsModule.forFeature([DiseasesEffects]),
        ],
        providers: [DiseasesFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(DiseasesFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allDiseases$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allDiseases$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadDiseasesSuccess` to manually update list
     */
    it('allDiseases$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allDiseases$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        DiseasesActions.loadDiseasesSuccess({
          diseases: [createDiseasesEntity('AAA'), createDiseasesEntity('BBB')],
        })
      );

      list = await readFirst(facade.allDiseases$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
