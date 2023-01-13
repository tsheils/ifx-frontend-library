import { Disease } from './disease';

describe('Disease', () => {
  it('should create an instance', () => {
    expect(new Disease({name: 'tim', gardId: 'tim'})).toBeTruthy();
  });
});
