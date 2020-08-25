import Koa from 'koa';

const mongoose = require('mongoose');
const { config } = require('../config');

async function mongoConnect() { // mongoDB 연결 함수
  const secret = await config;
  mongoose.connect(secret.testMongo,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('db와 연결되었습니다.'); })
    .catch((e: Error) => {
      throw (e);
    });
}

exports.db = async () => {
  await mongoConnect();
};

exports.dbMiddleware = async (ctx: Koa.Context, next: Function) => {
  if (mongoose.connection.readyState === 0) {
    await mongoConnect();
  }
  return next();
};
