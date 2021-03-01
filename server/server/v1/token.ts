import Koa from 'koa';
import Router from 'koa-router';
import crypto from 'crypto';

const { config } = require('../../config');

const router = new Router();

router.get('/', async (ctx: Koa.Context) => {
  const env = await config;
  //const token = env.rabumsToken;
  //if (!token) { ctx.throw(404, '찾을 수 없음'); }
  const hashToken = crypto.createHash('sha256').update(Buffer.from('123124412', 'utf8').toString('base64')).digest('hex');
  // token을 일단 아무렇게나 줌
  ctx.body = hashToken;
});

export = router
