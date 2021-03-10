import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';
import Cookie from 'koa-cookie';
import axios from 'axios';
import crypto from 'crypto';

const router = new Router();
const jwt = require('jsonwebtoken');
const { config } = require('../../config');

router.use(Bodyparser());
router.use(Cookie());

function hashData(data: any) {
  return crypto.createHash('sha256')
    .update(Buffer.from(data, 'utf8').toString('base64'))
    .digest('hex');
}
// 로그인
router.post('/', async (ctx: Koa.Context) => {
  const { body } = ctx.request;
  const id = body.userId;
  const pw = body.userPw;
  const env = await config;

  ctx.body = "success";
/*
  const check = hashData(hashData(env.rabumsToken) + hashData(hashData('')));

  if (body.userId === '' || body.userPw === check) { ctx.throw(400); }
  
  await axios.post(env.rabumsAddr, {
    token: env.rabumsToken,
    userId: id, // train96
    userPw: pw, // 변환된 비밀번호
  })
    .then((res) => {
      
      const accessToken = jwt.sign(res.data, env.accessSecretKey, { expiresIn: '1h' });
      // jwt 토큰 생성
      ctx.cookies.set('access_token', accessToken, { httpOnly: false });
      // 토큰을 쿠키로 발급 1000ms * 60 * 60 = 1h
      ctx.body = res.data;
      
    })
    .catch((e) => {
      ctx.status = e.response.status;
      ctx.body = e.response.data;
    });
    */
});

/*
* 유저 아이디와 비밀번호를 받음
* NERA 토큰과 같이 RABUMS 서버와 통신
* 로그인 성공시 유저 정보와 관련된 토큰 발급
*/

export = router
