const request = require('supertest');
const app = require('../../src/server');
const newProductData = require('../data/new-product.json');
let firstProduct;

it('POST /api/products', async () => {
  const response = await request(app)
                          .post('/api/products')
                          .send(newProductData);
  
  expect(response.statusCode).toBe(201)
  expect(response.body.name).toBe(newProductData.name);
  expect(response.body.description).toBe(newProductData.description);
  expect(response.body.price).toBe(newProductData.price);
});

it('should return 400 on POST /api/products', async () => {
  const response = await request(app)
                          .post('/api/products')
                          .send({ name: 'earphones' });
  expect(response.statusCode).toBe(400);
  expect(response.body).toStrictEqual({ message: 'description property missing' });
});

it('GET /api/products', async () => {
  const response = await request(app).get('/api/products');
  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body[0].name).toBeDefined();
  expect(response.body[0].description).toBeDefined();
  firstProduct = response.body[0];
});

it('GET /api/products/:id', async () => {
  const response = await request(app).get(`/api/products/${firstProduct.id}`);
  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe(firstProduct.name);
  expect(response.body.description).toBe(firstProduct.description);
});

it('GET id doenst exist /api/products/:id', async () => {
  const response = await request(app).get('/api/products/test');
  expect(response.statusCode).toBe(404);
  expect(response.body).toStrictEqual({ message: 'not found product' });
});

it('PUT /api/products/:id', async () => {
  const response = await request(app)
                          .put(`/api/products/${firstProduct.id}`)
                          .send({ name: 'updated name', description: 'updated description', price: 15 });
  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe('updated name');
  expect(response.body.description).toBe('updated description');
  firstProduct = { ...firstProduct, ...response.body };
});

it('should return 404 on PUT /api/products', async () => {
  const response = await request(app)
                          .put('/api/products/test')
                          .send({ name: 'updated name', description: 'updated description', price: 15 });
  expect(response.statusCode).toBe(404);
});

it('should return 400 on PUT /api/products', async () => {
  const response = await request(app)
                          .put(`/api/products/${firstProduct.id}`)
                          .send({ name: 'updated name' });
  expect(response.body).toStrictEqual({ message: 'description property missing' });
});

it('DELETE /api/products/:id', async () => {
  const response = await request(app).delete(`/api/products/${firstProduct.id}`);
  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe(firstProduct.name);
  expect(response.body.description).toBe(firstProduct.description);
});

it('DELETE id doenst exist /api/products/:id', async () => {
  const response = await request(app).delete(`/api/products/${firstProduct.id}`);
  expect(response.statusCode).toBe(404);
});