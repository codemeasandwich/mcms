function createUser(name, role) {
  return {
    name,
    role,
    createdAt: new Date().toISOString()
  };
}

describe('createUser function', () => {
  it('creates user with correct name and role', () => {
    const user = createUser('Alice', 'admin');

    // toEqual for object comparison (not toBe!)
    expect(user).toEqual(expect.objectContaining({
      name: 'Alice',
      role: 'admin'
    }));
  });

  it('includes a createdAt timestamp', () => {
    const user = createUser('Bob', 'user');

    // toHaveProperty checks if property exists
    expect(user).toHaveProperty('createdAt');
  });

  it('does not include password', () => {
    const user = createUser('Charlie', 'user');

    // not.toHaveProperty for absence
    expect(user).not.toHaveProperty('password');
  });
});
