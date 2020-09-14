import Koa from 'koa';

const jwt = require('jsonwebtoken');
const { config } = require('../config');
const { jwtInfo } = require('./type');

exports.jwtMiddleware = async (ctx: Koa.Context, next: Function) => {
  const token = ctx.cookies.get('access_token');
  // 쿠키에 저장된 토큰을 가져옴
  if (!token) {
    ctx.throw(401, '인증 실패');
    // 토큰이 없을 경우 인증 실패
  }
  const env = await config;
  const secretKey = env.accessSecretKey;
  // Vault 에 저장된 로그인 토큰 암호화 키
  let decoded: typeof jwt;
  try {
    decoded = jwt.verify(token, secretKey);
    // 유효한 토큰이라면

    // 토큰을 디코드

    const user : typeof jwtInfo = {
      userId: decoded.userId,
      userName: decoded.userName,
      userNumber: decoded.userNumber,
    };
      // 디코딩한 정보
    ctx.user = user;
    ctx.role = String(user.userNumber).charAt(0);
    const freshToken = jwt.sign(user, secretKey, { expiresIn: '1m' });
    // 새 토큰

    ctx.cookies.set('access_token', freshToken, { httpOnly: false });
    // api 요청시마다 쿠키 새로 발급
    ctx.user = decoded; // 유저 정보 update
    ctx.role = String(ctx.user.userNumber).charAt(0); // 권한 update
  } catch (error) {
    console.log(error);
    ctx.user = { // 에러일 경우 초기화
      userId: '',
      userName: '',
      userNumber: 0,
    };
    ctx.throw(401, '인증 실패');
  }
  return next();
};
