import { afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from './app.js';

describe('authentication request validation', () => {
  it('allows the standalone auth frontend origin on localhost ports 5173 and 4173', async () => {
    const response = await request(app)
      .options('/api/auth/register/passenger')
      .set('Origin', 'http://localhost:4173')
      .set('Access-Control-Request-Method', 'POST');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:4173');
  });

  it('rejects malformed passenger credentials before database access', async () => {
    const response = await request(app).post('/api/auth/login/passenger').send({ email: 'bad', password: 'x' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/email/i);
  });

  it('rejects malformed driver phone and OTP before database access', async () => {
    const otpRequest = await request(app).post('/api/auth/login/driver/request-otp').send({ phone: '123' });
    expect(otpRequest.status).toBe(400);
    const verify = await request(app).post('/api/auth/login/driver/verify-otp').send({ phone: '01712345678', otp: '12' });
    expect(verify.status).toBe(400);
  });

  it('rejects invalid reset tokens and weak passwords', async () => {
    const response = await request(app).post('/api/auth/password-reset/complete').send({ token: 'not-a-token', password: 'weak' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('rejects account registrations with invalid user fields', async () => {
    const response = await request(app).post('/api/auth/register/passenger').send({ fullName: 'A', email: 'bad', phone: '01712345678', password: 'Password1' });
    expect(response.status).toBe(400);
  });

  it('rejects admin registration unless the server enrollment code matches', async () => {
    const response = await request(app).post('/api/auth/register/admin').send({ adminPasscode: 'wrong' });
    expect(response.status).toBe(403);
  });
});

afterAll(async () => {
  const { default: pool } = await import('./database.js');
  await pool.end();
});
