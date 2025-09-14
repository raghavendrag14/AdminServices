const express = require('express');
const request = require('supertest');

// Mock User model as a constructor with instance.save and static methods
jest.mock('../../models/user', () => {
  function MockUser(data) {
    if (data) Object.assign(this, data);
    // instance save will be provided on prototype (resettable in tests)
    this.save = MockUser.prototype.save || (async function () { return this; });
  }

  // default instance save (override per-test)
  MockUser.prototype.save = jest.fn().mockResolvedValue();

  // static methods used by controller; implementations return chainable/query-like shapes where needed
  MockUser.findOne = jest.fn(); // returns Promise
  MockUser.find = jest.fn().mockImplementation(() => ({
    select: jest.fn().mockResolvedValue([]),
  })); // returns { select: fn } by default
  MockUser.findById = jest.fn().mockImplementation(() => ({
    select: jest.fn().mockResolvedValue(null),
  })); // returns { select: fn } by default
  MockUser.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 0 });

  return MockUser;
});

const User = require('../../models/user');
const userdetails = require('../../middleware/user.middleware');

describe('user.middleware controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/users', userdetails.createUser);
    app.get('/users', userdetails.getUsers);
    app.get('/users/:id', userdetails.getUserById);
    app.put('/users', userdetails.updateUser);
    app.delete('/users', userdetails.deleteUser);

    // reset mocks to sensible defaults (override in individual tests)
    User.findOne.mockReset();
    User.find.mockReset();
    User.findById.mockReset();
    User.deleteOne.mockReset();
    User.prototype.save = jest.fn().mockResolvedValue();
    // default chainable implementations
    User.find.mockImplementation(() => ({ select: jest.fn().mockResolvedValue([]) }));
    User.findById.mockImplementation(() => ({ select: jest.fn().mockResolvedValue(null) }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    User.findOne.mockResolvedValue(null);
    // ensure instance save resolves to the saved document
    User.prototype.save = jest.fn().mockImplementation(async function () {
      this._id = this._id || 'newid';
      return this;
    });

    const res = await request(app)
      .post('/users')
      .send({ username: 'testuser', email: 'test@example.com', password: 'pass1234', roleId: 'roleid' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User created');
    expect(res.body.user.username).toBe('testuser');
  });

  it('should not create a user if username or email exists', async () => {
    User.findOne.mockResolvedValue({ username: 'testuser' });
    const res = await request(app)
      .post('/users')
      .send({ username: 'testuser', email: 'test@example.com', password: 'pass1234', roleId: 'roleid' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Username or email already exists');
  });

  it('should get all users', async () => {
    // make find().select(...) resolve to expected users
    User.find.mockImplementation(() => ({ select: jest.fn().mockResolvedValue([{ username: 'testuser' }]) }));
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.users[0].username).toBe('testuser');
  });

  it('should get user by id', async () => {
    // make findById(...).select(...) resolve to a user
    User.findById.mockImplementation(() => ({ select: jest.fn().mockResolvedValue({ _id: 'userid', username: 'testuser' }) }));
    const res = await request(app).get('/users/userid');
    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe('testuser');
  });

  it('should return 404 if user not found by id', async () => {
    User.findById.mockImplementation(() => ({ select: jest.fn().mockResolvedValue(null) }));
    const res = await request(app).get('/users/userid');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  it('should update a user', async () => {
    const mockUser = { save: jest.fn().mockResolvedValue(), _id: 'userid', username: 'olduser', email: 'old@example.com', roleId: 'roleid' };
    User.findById.mockResolvedValue(mockUser);
    const res = await request(app)
      .put('/users')
      .send({ id: 'userid', username: 'newuser', email: 'new@example.com', roleId: 'roleid' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User updated');
    expect(res.body.user.username).toBe('newuser');
  });

  it('should return 404 if user not found for update', async () => {
    User.findById.mockResolvedValue(null);
    const res = await request(app)
      .put('/users')
      .send({ id: 'userid', username: 'newuser', email: 'new@example.com', roleId: 'roleid' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });

  it('should delete a user', async () => {
    User.findById.mockResolvedValue({ _id: 'userid' });
    User.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = await request(app)
      .delete('/users')
      .send({ id: 'userid' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted');
  });

  it('should return 404 if user not found for delete', async () => {
    User.findById.mockResolvedValue(null);
    const res = await request(app)
      .delete('/users')
      .send({ id: 'userid' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});
