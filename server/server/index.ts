import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import Api, { route } from './api';
import User from './v1/user';

const app = new Koa();
const router = new Router();

router.get('/', (ctx: Koa.Context) => {
  ctx.body = 'hello, NERA!';
});

router.use('/api', Api.routes());
router.use('/v1/user', User.routes());
app.use(Logger());
app.use(router.routes());

export = app
