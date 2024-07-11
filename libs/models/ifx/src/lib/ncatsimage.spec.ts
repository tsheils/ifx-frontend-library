import { NCATSImage } from './ncatsimage';

describe('NCATSImage', () => {
  it('should create an instance', () => {
    expect(new NCATSImage({ url: 'Yo', caption: 'yo' })).toBeTruthy();
  });
});
