import Koa from 'koa';

const mongoose = require('mongoose');
const { config } = require('../config');
const { collectionInfo } = require('./type');

async function mongoConnect() { // mongoDB 연결 함수
  const secret = await config;
  await mongoose.connect(secret.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    let check = collections.findIndex((coll: typeof collectionInfo) => coll.name === 'answerpapers');
    if (check === -1) {
      await mongoose.connection.db.createCollection('answerpapers');
    }
    check = collections.findIndex((coll: typeof collectionInfo) => coll.name === 'groups');
    if (check === -1) {
      await mongoose.connection.db.createCollection('groups');
    }
    check = collections.findIndex((coll: typeof collectionInfo) => coll.name === 'assignments');
    if (check === -1) {
      await mongoose.connection.db.createCollection('assignments');
    }
    check = collections.findIndex((coll: typeof collectionInfo) => coll.name === 'counters');
    if (check === -1) {
      await mongoose.connection.db.createCollection('counters');
    }
    console.log('DB와 연결되었습니다.');
  })
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
