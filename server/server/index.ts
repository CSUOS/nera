import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import Api, { route } from './api';
import Auth from './v1/auth';

const serve = require('koa-static');
const send = require('koa-send');

const app = new Koa();
const router = new Router();

router.get('/', (ctx: Koa.Context) => {
  ctx.body = 'hello, NERA!';
});

router.use('/api', Api.routes());
router.use('/v1/auth', Auth.routes());

app.use(Logger());
app.use(router.routes());
app.use(serve(`${__dirname}/../build`));
app.use(async (ctx) => {
  if (ctx.status === 404) await send(ctx, 'index.html', { root: `${__dirname}/../build` });
});
export = app
