const request = require('supertest');
const app = require('../index');
const prisma = require('../prisma/client');

describe('App Endpoints', () => {
  afterAll(async () => {
    // Disconnect Prisma after tests
    await prisma.$disconnect();
  });

  it('should return 200 on root route', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Apps worked successfully');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route-12345');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });
});
