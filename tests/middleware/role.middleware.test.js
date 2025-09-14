const express = require('express');
const request = require('supertest');

// Mock Role model as a constructor with instance.save and static methods
jest.mock('../../models/role', () => {
  function MockRole(data) {
    if (data) Object.assign(this, data);
    // ensure instance.save exists
    this.save = MockRole.prototype.save || jest.fn().mockResolvedValue(this);
  }
  // prototype default (can be overridden in tests)
  MockRole.prototype.save = jest.fn().mockResolvedValue();

  // static methods used by the controller
  MockRole.find = jest.fn();
  MockRole.findOne = jest.fn();
  MockRole.findById = jest.fn();
  MockRole.deleteOne = jest.fn();

  return MockRole;
});

const Role = require('../../models/role');
const controller = require('../../middleware/role.middleware');

describe('role.middleware controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/roles', controller.getAllRoles);
    app.post('/roles', controller.createRole);
    app.put('/roles', controller.updateRole);
    app.delete('/roles', controller.deleteRole);

    // sensible defaults (override per-test)
    Role.find.mockReset();
    Role.findOne.mockReset();
    Role.findById.mockReset();
    Role.deleteOne.mockReset();
    Role.prototype.save = jest.fn().mockResolvedValue(); // reset instance save
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all roles', async () => {
    Role.find.mockResolvedValue([{ roleName: 'Admin' }]);
    const res = await request(app).get('/roles');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ roleName: 'Admin' }]);
  });

  it('should create a role', async () => {
    Role.findOne.mockResolvedValue(null);
    // ensure save resolves with the created role object
    Role.prototype.save = jest.fn().mockImplementation(async function () {
      this._id = this._id || 'newRoleId';
      return this;
    });

    const res = await request(app)
      .post('/roles')
      .send({ roleName: 'User', roleCode: 'USER', privileges: ['read'] });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Role created');
    expect(res.body.role.roleName).toBe('User');
  });

  it('should not create a role if missing fields', async () => {
    const res = await request(app)
      .post('/roles')
      .send({ roleName: 'User' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('roleName, roleCode and privileges are required');
  });

  it('should not create a role if role exists', async () => {
    Role.findOne.mockResolvedValue({ roleName: 'User' });
    const res = await request(app)
      .post('/roles')
      .send({ roleName: 'User', roleCode: 'USER', privileges: ['read'] });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Role name already exists');
  });

  it('should update a role', async () => {
    const mockRole = { save: jest.fn().mockResolvedValue(), roleName: 'Old', roleCode: 'OLD', privileges: [] };
    Role.findById.mockResolvedValue(mockRole);
    const res = await request(app)
      .put('/roles')
      .send({ id: 'roleid', roleName: 'New', roleCode: 'NEW', privileges: ['write'] });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Role updated');
    expect(res.body.role.roleName).toBe('New');
  });

  it('should not update a role if not found', async () => {
    Role.findById.mockResolvedValue(null);
    const res = await request(app)
      .put('/roles')
      .send({ id: 'roleid', roleName: 'New', roleCode: 'NEW', privileges: ['write'] });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Role not found');
  });

  it('should delete a role', async () => {
    Role.findById.mockResolvedValue({ _id: 'roleid' });
    Role.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = await request(app)
      .delete('/roles')
      .send({ id: 'roleid' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Role deleted');
  });

  it('should not delete a role if not found', async () => {
    Role.findById.mockResolvedValue(null);
    const res = await request(app)
      .delete('/roles')
      .send({ id: 'roleid' });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Role not found');
  });
});
