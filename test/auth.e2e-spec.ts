import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestAppModule } from './test-app.module';
import { setupTestApp } from './setup-app';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: number;

  const testUser = {
    name: 'E2E User',
    email: `e2e_${Date.now()}@example.com`,
    password: 'Password123!',
  };

  const updatedUser = {
    name: 'Updated E2E User',
    email: `updated_${Date.now()}@example.com`,
    password: 'NewPassword123!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupTestApp(app);
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user (201)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Success');
      expect(res.body.data).toMatchObject({
        name: testUser.name,
        email: testUser.email,
        isActive: true,
      });
      userId = res.body.data.id;
    });

    it('should fail if email already exists (409)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Email already registered');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully and return accessToken (200)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      accessToken = res.body.data.accessToken;
    });

    it('should fail with wrong password (401)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /users/profile', () => {
    it('should get current user profile (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        id: userId,
        name: testUser.name,
        email: testUser.email,
      });
    });

    it('should fail without token (401)', async () => {
      await request(app.getHttpServer()).get('/users/profile').expect(401);
    });
  });

  describe('PUT /users/update/:id', () => {
    it('should update own profile (200)', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/update/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedUser)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(updatedUser.name);
      expect(res.body.data.email).toBe(updatedUser.email);
    });

    it('should forbid updating another user (403)', async () => {
      const otherUserId = userId + 999;
      await request(app.getHttpServer())
        .put(`/users/update/${otherUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedUser)
        .expect(403);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully (200)', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ email: updatedUser.email, password: updatedUser.password })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Logged out');
    });
  });
});
