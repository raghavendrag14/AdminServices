const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

// Set up environment variable for JWT secret
process.env.JWT_SECRET = 'testsecret';

const auth = require('../../middleware/auth.middleware');

describe('auth.authentication middleware', () => {
  let app;
  let validToken;

  beforeAll(() => {
    // Create a valid token for testing
    validToken = jwt.sign({ id: 'user123', roleId: 'role123' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/protected', auth.authentication, (req, res) => {
      res.status(200).json({ message: 'Authenticated', user: req.user });
    });
  });

  it('should authenticate with valid token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Authenticated');
    expect(res.body.user.id).toBe('user123');
    expect(res.body.user.roleId).toBe('role123');
  });

  it('should reject request with no token', async () => {
    const res = await request(app).get('/protected');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Missing token');
  });

  it('should reject request with invalid token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid/expired token');
  });
});