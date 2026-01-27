// A simple function to test
function add(a, b) {
  return a + b;
}

describe('add function', () => {
  it('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('adds negative numbers', () => {
    expect(add(-1, -1)).toBe(-2);
  });

  it('returns a number type', () => {
    expect(typeof add(1, 1)).toBe('number');
  });
});
