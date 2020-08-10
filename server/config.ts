import Koa from 'koa';

const axios = require('axios');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = new Koa();

app.context.user = 'userInfo';
app.context.env = 'env';
app.context.role = 'role';

export default function getEnv() {
  return axios.get(process.env.VADDR, {
    headers: {
      'X-Vault-Token': process.env.VAULT_TOKEN,
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
  const secretKey = ctx.env.accessSecretKey; // 나중에 다른값
  if (!token) {
    //ctx.throw(401, '인증 실패');
  }
  let decoded: typeof jwt;
  try {
    decoded = await jwtDecoder(token, secretKey);
    if (Date.now() / 1000 - decoded.iat > 60 * 60) {
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
