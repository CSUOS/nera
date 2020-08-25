import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import Api, { route } from './api';
import Login from './v1/login';
import Logout from './v1/logout';
import Answer from './v1/answer';
import Student from './v1/student';
import Test from './v1/cookieTest'; // 테스트용 쿠키 발급
import Assignment from './v1/assignment';

const { createProxyMiddleware } = require('http-proxy-middleware');

const serve = require('koa-static');
const send = require('koa-send');
const { jwtMiddleware, envMiddleware } = require('../config');

const app = new Koa();
const router = new Router();
const login = new Router();

app.context.user = { // 유저 정보
  _id: 0, // 고유 id
  userId: '', // 유저 id
  userName: '', // 유저 이름
  userNumber: 0, // 학번
};
app.context.env = { // 환경변수
  accessSecretKey: '', // 로그인 토큰 암호화 키
  mongoAddr: '', // MongoDB 주소
  rabumsAddr: '', // RABUMS 주소
  rabumsToken: '', // RABUMS 토큰
};
app.context.role = ''; // 유저 권한 1 - 교수, 2 - 학생

router.get('/', (ctx: Koa.Context) => {
  ctx.body = 'hello, NERA!';
});

login.use('/v1/login', Login.routes());
login.use('/v1/cookieTest', Test.routes());

router.use('/api', Api.routes());
router.use('/v1/answer', Answer.routes());
router.use('/v1/student', Student.routes());
router.use('/v1/assignment', Assignment.routes());
router.use('/v1/logout', Logout.routes());

app.use(Logger());
app.use(envMiddleware);
app.use(login.routes());
app.use(jwtMiddleware);
app.use(router.routes());

app.use(serve(`${__dirname}/../build`));
app.use(async (ctx) => {
  if (ctx.status === 404) await send(ctx, 'index.html', { root: `${__dirname}/../build` });
});

export = app
