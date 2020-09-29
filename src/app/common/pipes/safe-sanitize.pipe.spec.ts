import { SafeSanitizePipe } from './safe-sanitize.pipe';

describe('SafeSanitizePipe', () => {
  it('create an instance', () => {
    const pipe = new SafeSanitizePipe();
    expect(pipe).toBeTruthy();
  });
});
