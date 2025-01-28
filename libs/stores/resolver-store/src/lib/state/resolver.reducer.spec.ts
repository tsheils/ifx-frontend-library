import { Action } from '@ngrx/store'
import { ResolverResponse } from 'ifx'
import { LoadResolverOptionsActions } from './resolver.actions'

import * as ResolverActions from './resolver.actions'
import {
  ResolverState,
  initialResolverState,
  resolverReducer,
} from './resolver.reducer'

describe('Resolver Reducer', () => {
  const createResolverEntity = (id: string, name = ''): ResolverResponse => ({
    id,
    input: name || `name-${id}`,
    response: name || `name-${id}`,
    source: name || `name-${id}`,
    url: name || `name-${id}`,
  })

  describe('valid Resolver actions', () => {
    it('loadResolverSuccess should return the list of known Resolver', () => {
      const action = LoadResolverOptionsActions.loadResolverOptionsSuccess

      const result: ResolverState = resolverReducer(
        initialResolverState,
        action
      )

      expect(result.loaded).toBe(true)
      expect(result.ids.length).toBe(0)
    })
  })

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action

      const result = resolverReducer(initialResolverState, action)

      expect(result).toBe(initialResolverState)
    })
  })
})
