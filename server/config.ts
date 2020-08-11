import Koa from 'koa';

const axios = require('axios');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

export default function getEnv() {
  return axios.get(process.env.VADDR, {
    // VAULT 서버와 통신, 환경변수로 VAULT 주소 받음
    headers: {
      'X-Vault-Token': process.env.VAULT_TOKEN,
      // 환경변수로 VAULT 토큰 값 받음
    },
  }).then((res: any) => res.data.data.data).catch((err: any) => {
    console.log(err);
  });
}

function jwtDecoder(token: any, secretKey: any) {
  return new Promise(
    (resolve, reject) => {
      jwt.verify(token, secretKey, (error: any, decoded: any) => {
        if (error) reject(error);
        resolve(decoded);
      });
    },
  );
}

exports.jwtMiddleware = async (ctx: Koa.Context, next: any) => {
  const token = ctx.cookies.get('access_token');
  // 쿠키에 저장된 토큰을 가져옴
  if (!token) {
    ctx.throw(401, '인증 실패');
    // 토큰이 없을 경우 인증 실패
  }
  const secretKey = ctx.env.accessSecretKey;
  // ctx.env에 저장된 로그인 토큰 암호화 키

  let decoded: typeof jwt;
  try {
    decoded = await jwtDecoder(token, secretKey);
    // 토큰을 디코드

    if (Date.now() / 1000 - decoded.iat > 60 * 50) {
      // 발행된지 50분이 지났을 경우 재발급
      const user = decoded;
      const freshToken = jwt.sign(user, secretKey, { expiresIn: '1h' });
      ctx.cookies.set('access_token', freshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 });
    }
    ctx.user = decoded;
    ctx.role = String(ctx.user.userNumber).charAt(0);
  } catch (error) {
    console.log(error);
    ctx.user = null;
  }
  return next();
};

exports.envMiddleware = async (ctx: Koa.Context, next: any) => {
  try {
    const env = await getEnv();
    ctx.env = env;
  } catch (error) {
    console.log(error);
    ctx.env = null;
  }
  return next();
};
