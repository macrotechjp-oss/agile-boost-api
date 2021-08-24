const request = require("supertest");
const app = require("../app");

describe('疎通テスト', () => {
  test('【成功】- 200ステータスコード + MSG', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.statusCode).toBe(200);
  });
});