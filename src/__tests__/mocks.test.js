describe('mock functions', () => {
  it('tracks function calls', () => {
    const mockFn = jest.fn();

    mockFn('hello');
    mockFn('world');

    // Check how many times it was called
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('tracks call arguments', () => {
    const mockFn = jest.fn();

    mockFn('first', 'second');

    // Check what arguments were passed
    expect(mockFn).toHaveBeenCalledWith('first', 'second');
  });

  it('can return custom values', () => {
    const mockFn = jest.fn().mockReturnValue(42);

    const result = mockFn();

    expect(result).toBe(42);
  });

  it('can mock implementation', () => {
    const mockFn = jest.fn((x) => x * 2);

    expect(mockFn(5)).toBe(10);
    expect(mockFn(3)).toBe(6);
  });
});
