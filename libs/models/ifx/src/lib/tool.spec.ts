import { Tool } from './tool';

describe('Tool', () => {
  it('should create an instance', () => {
    expect(new Tool({ toolName: 'dsdfdssdg' })).toBeTruthy();
  });
});
