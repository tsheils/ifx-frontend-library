import { Author } from './author';

describe('Author', () => {
  it('should create an instance', () => {
    expect(
      new Author({ firstName: 'tim', lastName: 'tim', fullName: 'tim' })
    ).toBeTruthy();
  });
});
