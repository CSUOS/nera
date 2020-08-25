import request from 'supertest';
import app from './index';

test('/api api서비스 동작의 확인', async () => {
  const response = await request(app.callback()).get('/api');
  expect(response.status).toBe(200);
  expect(response.text).toBe('This is NERA\'s api directory.');
});
