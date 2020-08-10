import Koa from 'koa';
import Router from 'koa-router';

const { test } = require('../../config');

const router = new Router();
router.get('/', async (ctx: Koa.Context) => {
  ctx.body = ctx.role;
  console.log(test);
});

export = router;
