const request = require("supertest");
const app = require("../../app");

describe('Test a 200', () => {
  test('It should respond with a 200 status', async () => {
    const response = await request(app).get('/api/v1/users');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test a 200', () => {
  test('It should respond with a 200 status', async () => {
    const response = await request(app).post('/api/v1/users');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test a 200', () => {
  test('It should respond with a 200 status', async () => {
    const response = await request(app).get('/api/v1/users/10');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test a 200', () => {
  test('It should respond with a 200 status', async () => {
    const response = await request(app).put('/api/v1/users').query({
      id: 10
    });
    expect(response.statusCode).toBe(200);
  });
});

describe('Test a 200', () => {
  test('It should respond with a 200 status', async () => {
    const response = await request(app).delete('/api/v1/users').query({
      user_id: 10
    });
    expect(response.statusCode).toBe(200);
  });
});