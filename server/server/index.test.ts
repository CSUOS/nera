import request from 'supertest';
import app from './index';

test('/ GET 요청 작동 확인', async () => {
  const response = await request(app.callback()).get('/');
  expect(response.status).toBe(200);
  expect(response.text).toBe('hello, NERA!');
});
