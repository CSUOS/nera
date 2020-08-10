import dotenv from 'dotenv';
import app from './server/index';
import getEnv from './config';

const mongoose = require('mongoose');

async function mongoConnect() {
  const secret = await getEnv();
  mongoose.connect(secret.mongoAddr,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => { console.log('db와 연결되었습니다.'); });
}

mongoConnect();

const port = process.env.PORT || 3000;

console.info(`Listening to http://0.0.0.0:${port}`);
const server = app.listen(port);

export default server;
