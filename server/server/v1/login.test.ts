import dotenv from 'dotenv';
import request from 'supertest';
import app from '../index';

const crypto = require('crypto');

dotenv.config();
test('/ 로그인 확인', async () => {
  const login = {
    user_id: 'Mountain Dew',
    user_pw: 'Milkis',
  };
  const pw = Buffer.from(crypto.createHmac('sha256', process.env.LoginSecretKey)
    .update(Buffer.from(login.user_pw).toString('base64'))
    .digest('hex')).toString('base64');
  const response = await request(app.callback())
    .post('/v1/login')
    .send(login);
  expect(response.status).toBe(200);
  expect(response.text).toBe(`{"id":"${login.user_id}","pw":"${pw}"}`);
});
