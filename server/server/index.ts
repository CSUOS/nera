import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import Api, { route } from './api';
import Auth from './v1/auth';
import Answer from './v1/answer';
import Student from './v1/student';
import Test from './v1/cookieTest'; // 테스트용 쿠키 발급

const serve = require('koa-static');
const send = require('koa-send');

const app = new Koa();
const router = new Router();

router.get('/', (ctx: Koa.Context) => {
  ctx.body = 'hello, NERA!';
});

router.use('/api', Api.routes());
router.use('/v1/auth', Auth.routes());
router.use('/v1/answer', Answer.routes());
router.use('/v1/student', Student.routes());
router.use('/v1/cookieTest', Test.routes());

app.use(Logger());
app.use(router.routes());
app.use(serve(`${__dirname}/../build`));
app.use(async (ctx) => {
  if (ctx.status === 404) await send(ctx, 'index.html', { root: `${__dirname}/../build` });
});
export = app
