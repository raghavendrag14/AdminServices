const express = require('express');
const request = require('supertest');
const checkPermission = require('../../middleware/checkPermission');

// Mock Role model
jest.mock('../../models/role', () => ({
  findById: jest.fn(),
}));

const Role = require('../../models/role');

describe('checkPermission middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // Simulate JWT middleware
    app.get('/test', (req, res, next) => {
      req.user = { roleId: 'role123', id: 'user123' };
      next();
    }, checkPermission('viewUsers'), (req, res) => {
      res.status(200).json({ message: 'Access granted' });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access if privilege exists', async () => {
    Role.findById.mockResolvedValue({ privileges: ['viewUsers'] });
    const res = await request(app).get('/test');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Access granted');
  });

  it('should deny access if privilege does not exist', async () => {
    Role.findById.mockResolvedValue({ privileges: ['editUsers'] });
    const res = await request(app).get('/test');
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Access denied: insufficient privileges');
  });

  it('should return 401 if role not found', async () => {
    Role.findById.mockResolvedValue(null);
    const res = await request(app).get('/test');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('User not found');
  });

  it('should return 500 on error', async () => {
    Role.findById.mockRejectedValue(new Error('DB error'));
    const res = await request(app).get('/test');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error');
  });
});