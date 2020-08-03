import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';
import Cookie from 'koa-cookie';
import dotenv from 'dotenv';
import axios from 'axios';

const router = new Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

dotenv.config();

router.use(Bodyparser());
router.use(Cookie());

// 로그인
router.post('/login', (ctx: Koa.Context) => {
  const { body } = ctx.request;
  const id = body.user_id;
  const pw = Buffer.from(crypto.createHmac('sha256', process.env.LoginSecretKey)
    .update(Buffer.from(body.user_pw).toString('base64'))
    .digest('hex')).toString('base64');
  // base64형태로 변환 -> 비밀키와 sha256으로 암호화 -> base64형태로 변환
  const loginInfo = {
    id, pw,
  };
  //  ctx.cookies.set('access_token', 'login', { httpOnly: true, maxAge: 1000 * 60 * 60 });
  ctx.body = loginInfo;
  // 일단 사용자 아이디와 비밀번호(암호화)를 보이도록
  /*
  axios.post('/v1/get', {
    userId: id,
    userPw: pw,
  }).then((response) => {
    ctx.body = response;
    const token = jwt.sign(response, process.env.AccessSecretKey, { expiresIn: '7d' });
    ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
  }).catch((error) => {
    ctx.body = error;
  });
  */
});
/*
* 유저 아이디와 비밀번호를 받음
* NERA 토큰과 같이 RABUMS 서버와 통신
* 로그인 성공시 유저 정보와 관련된 토큰 발급
*/
// 로그아웃
router.post('/logout', (ctx: Koa.Context) => {
  ctx.cookies.set('access_token', '', { httpOnly: true, maxAge: 0 });
  ctx.status = 204;
});
export = router
