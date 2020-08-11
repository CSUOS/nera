import Koa from 'koa';
import Router from 'koa-router';

const secret = require('../../server');

const router = new Router();

router.get('/', (ctx: Koa.Context) => {
  const token = secret.env.rabumsToken;
  if (!token) { ctx.throw(404, '찾을 수 없음'); }
  ctx.body = token;
});

export = router
