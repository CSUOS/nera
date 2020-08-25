import Koa from 'koa';
import Router from 'koa-router';

const router = new Router();

router.get('/', (ctx: Koa.Context) => {
  ctx.body = 'This is NERA\'s api directory.';
});

export = router
