import { Disease } from './disease';

describe('Disease', () => {
  it('should create an instance', () => {
    expect(new Disease({name: 'tim', gard_id: 'tim'})).toBeTruthy();
  });
});
