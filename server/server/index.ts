import Koa from 'koa';
import Router from 'koa-router';
import Logger from 'koa-logger';
import Login from './v1/login';
import Logout from './v1/logout';
import Answer from './v1/answer';
import Student from './v1/student';
import Test from './v1/cookieTest'; // 테스트용 쿠키 발급
import Assignment from './v1/assignment';
import Token from './v1/token';
import UserInfo from './v1/userInfo';

const { createProxyMiddleware } = require('http-proxy-middleware');

const serve = require('koa-static');
const send = require('koa-send');
const cors = require('@koa/cors');
const { jwtMiddleware } = require('../config');
const { dbMiddleware } = require('./db');

const app = new Koa();
const router = new Router();
const login = new Router();

const corsOption = {
  origin: 'http://localhost:3001',
  credentials: true,
};
app.use(cors(corsOption));
app.context.user = { // 유저 정보 저장
  _id: Number, // 고유 id
  userId: String, // 유저 id
  userName: String, // 유저 이름
  userNumber: Number, // 학번
};

app.context.role = String; // 유저 권한 1 - 교수, 2 - 학생

login.use('/v1/login', Login.routes()); // 로그인 필요하지 않은 api
login.use('/v1/cookieTest', Test.routes());
login.use('/v1/token', Token.routes());

// 로그인이 필요한 api
router.use('/v1/answer', Answer.routes());
router.use('/v1/student', Student.routes());
router.use('/v1/assignment', Assignment.routes());
router.use('/v1/logout', Logout.routes());
router.use('/v1/userInfo', UserInfo.routes());

app.use(Logger());

app.use(dbMiddleware);
app.use(login.routes());
app.use(jwtMiddleware);
app.use(router.routes());

app.use(serve(`${__dirname}/../build`));
app.use(async (ctx) => {
  if (ctx.status === 404) await send(ctx, 'index.html', { root: `${__dirname}/../build` });
});

export = app
