import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Disease } from "@ncats-frontend-library/models/rdas";
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nrwl/angular/testing';
import { Apollo } from "apollo-angular";

import * as DiseasesActions from './diseases.actions';
import { DiseasesEffects } from './diseases.effects';
import { DiseasesFacade } from './diseases.facade';
import { DiseasesEntity } from './diseases.models';
import {
  DISEASES_FEATURE_KEY,
  State,
  initialState,
  diseasesReducer,
} from './diseases.reducer';
import * as DiseasesSelectors from './diseases.selectors';

interface TestSchema {
  diseases: State;
}

describe('DiseasesFacade', () => {
  let facade: DiseasesFacade;
  let store: Store<TestSchema>;
  const createDiseasesEntity = (gardId: string, name = ''): Disease => ({
    gardId,
    name: name || `name-${gardId}`,
    epiCount: 0,
    nonEpiCount: 0,
    projectCount: 0,
    clinicalTrialsCount: 0
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
        providers: [
          Apollo
        ]
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let list = await readFirst(facade.allDiseases$);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      list = await readFirst(facade.allDiseases$);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);
    });

    /**
     * Use `loadDiseasesSuccess` to manually update list
     */
    it('allDiseases$ should return the loaded list; and loaded flag == true', async () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let list = await readFirst(facade.allDiseases$);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        DiseasesActions.loadDiseasesSuccess({
          diseases: [createDiseasesEntity('AAA'), createDiseasesEntity('BBB')],
        })
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      list = await readFirst(facade.allDiseases$);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
