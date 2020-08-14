import Koa from 'koa';
import Router from 'koa-router';
import crypto from 'crypto';

const secret = require('../../server');

const router = new Router();

router.get('/', async (ctx: Koa.Context) => {
  try {
    const token = secret.env.rabumsToken;
    const hashToken = await crypto.createHash('sha256').update(Buffer.from(token, 'utf8').toString('base64')).digest('hex');
    if (!token) { ctx.throw(404, '찾을 수 없음'); }
    ctx.body = hashToken;
  } catch (error) {
    ctx.status = error.status;
    ctx.body = error;
  }
});

export = router
