import Koa from 'koa';
import { logger } from '../config';
const mongoose = require('mongoose');
const { collectionInfo } = require('./type');

async function mongoConnect() { // mongoDB 연결 함수
  mongoose.connect(`mongodb://localhost:27017/`,
    {
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
      logger.info('DB Connected');
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
