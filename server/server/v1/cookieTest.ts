import Koa from 'koa';
import Router from 'koa-router';

const router = new Router();

const jwt = require('jsonwebtoken');

const userInfo = {
  _id: 0,
  userId: 'thereisnotruth',
  userName: '고태진',
  userNumber: 1016920003,
};

<<<<<<< HEAD
router.get('/', (ctx: Koa.Context) => {
  const token = jwt.sign(userInfo,'tobi',{ expiresIn: '7d' });
  //const token = jwt.sign(userInfo, process.env.AccessSecretKey, { expiresIn: '7d' });
  ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
  ctx.body = 'test';
=======
router.get('/', async (ctx: Koa.Context) => {
  const token = jwt.sign(userInfo, ctx.env.accessSecretKey, { expiresIn: '1h' });
  ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
  // 쿠키 발급, 유효시간 1시간 1000ms * 60 * 60
  ctx.user = userInfo;
  ctx.body = ctx.user;
  ctx.role = String(userInfo.userNumber).charAt(0);
>>>>>>> b0c8f16d598da43997f289ef9f5fc384ac516d5b
});

router.get('/test', async (ctx: Koa.Context) => {
  const token = ctx.cookies.get('access_token');
  const user = jwt.verify(token, ctx.env.accessSecretKey);
  ctx.body = user;
  console.log(user.iat);
});
export = router
