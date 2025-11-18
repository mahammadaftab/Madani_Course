const request = require('supertest');
const app = require('../src/server');

describe('API Endpoints', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app)
      .get('/api/unknown')
      .expect(404);
  });

  it('should have auth endpoint', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123'
      })
      .expect(200);
  });
});