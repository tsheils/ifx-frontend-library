import { User } from '@ncats-frontend-library/models/utils';
import { UserLoginActions } from './users.actions';
import { initialState, usersReducer, UserState } from './users.reducer';
import { Action } from '@ngrx/store';

describe('Users Reducer', () => {
  const createUsersEntity = (uid: string, displayName = ''): User =>
    new User({
      uid,
      displayName: displayName || `name-${uid}`,
    });

  describe('valid Users actions', () => {
    it('loadUsersSuccess should return the list of known Users', () => {
      const users = createUsersEntity('PRODUCT-zzz');
      const action = UserLoginActions.loginUserSuccess({ user: users });

      const result: UserState = usersReducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(1);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = usersReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
