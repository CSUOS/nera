import Koa from 'koa';
import Router from 'koa-router';
import getEnv from '../../config';

const router = new Router();

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = ctx.role;
});

export = router;
