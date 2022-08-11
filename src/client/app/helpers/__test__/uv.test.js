import { getUVColor } from '../uv';

describe('UV Helper func', () => {
  test('Should return #fb8500 (red) color when UV is high', () => {
    const mock = getUVColor(6.3);
    expect(mock).toBe('#fb8500');
  });

  test('Should return black color when not found UV range', () => {
    const mock = getUVColor('-432');
    expect(mock).toBe('black');
  });
});
