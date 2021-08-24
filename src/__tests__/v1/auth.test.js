const request = require("supertest");
const app = require("../../app");

describe('ユーザー新規登録', () => {
  test('【成功】- 200ステータスコード + ユーザー情報', async () => {
    const response = await request(app).post('/api/v1/auth/sign-up').query({
      userEmail: "",
      userPassword: ""
    });
    expect(response.statusCode).toBe(200);
  });
});

describe('ユーザーログイン', () => {
  test('【成功】- 200ステータスコード + ユーザー情報', async () => {
    const response = await request(app).post('/api/v1/auth/sign-in');
    expect(response.statusCode).toBe(200);
  });
});

describe('ユーザーログアウト', () => {
  test('It should respond with a 200 status', async () => {
    const response = await request(app).get('/api/v1/auth/sign-out');
    expect(response.statusCode).toBe(200);
  });
});

describe('ユーザーアカウント有効化', () => {
  test('It should respond with a 200 status', async () => {
    const response = await request(app).put('/api/v1/users').query({
      id: 10
    });
    expect(response.statusCode).toBe(200);
  });
});

describe('パスワード再設定', () => {
  test('It should respond with a 200 status', async () => {
    const response = await request(app).delete('/api/v1/users').query({
      user_id: 10
    });
    expect(response.statusCode).toBe(200);
  });
});