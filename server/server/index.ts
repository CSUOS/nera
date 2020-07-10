import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import Api from './api';

const app = new Koa();
const router = new Router();

router.get('/', (ctx: Koa.Context) => {
  ctx.body = 'hello, NERA!';
});

router.use('/api', Api.routes());

app.use(Logger());
app.use(router.routes());

export = app
