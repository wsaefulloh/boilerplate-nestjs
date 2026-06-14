import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestAppModule } from './test-app.module';
import { setupTestApp } from './setup-app';

describe('Product (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let productId: number;
  let productUuid: string;

  const user = {
    name: 'Product Owner',
    email: `product_${Date.now()}@example.com`,
    password: 'Product123!',
  };

  const newProduct = {
    name: 'Test Product',
    description: 'Test Description',
    price: 20000,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupTestApp(app);
    await app.init();

    // Register user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201);

    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200);

    accessToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe('POST /products', () => {
    it('should create a product (201)', async () => {
      const res = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newProduct)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Product created successfully');
      expect(res.body.data).toMatchObject({
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
      });
      productId = res.body.data.id;
      productUuid = res.body.data.uuid;
    });
  });

  describe('GET /products', () => {
    it('should get products list with pagination (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/products')
        .query({ search: 'test', page: 1, limit: 10 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /products/my-products', () => {
    it('should get products owned by the logged in user (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/products/my-products')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toMatchObject({
        id: productId,
        uuid: productUuid,
        name: newProduct.name,
      });
    });
  });

  describe('GET /products/:id', () => {
    it('should get a single product by id (200)', async () => {
      const res = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(productId);
      expect(res.body.data.name).toBe(newProduct.name);
    });

    it('should return 404 for non-existent product', async () => {
      await request(app.getHttpServer()).get('/products/99999').expect(404);
    });
  });

  describe('PUT /products/:id', () => {
    const updatedProduct = {
      name: 'Updated Product Name',
      description: 'Updated Description',
      price: 35000,
      is_active: false,
    };

    it('should update the product (200)', async () => {
      const res = await request(app.getHttpServer())
        .put(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedProduct)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Product Updated successfully');
      expect(res.body.data).toMatchObject({
        id: productId,
        name: updatedProduct.name,
        price: updatedProduct.price,
        isActive: updatedProduct.is_active,
      });
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete the product (200)', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Product deleted successfully');
    });

    it('should return 404 when deleting already deleted product', async () => {
      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
