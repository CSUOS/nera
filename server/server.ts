import Koa from 'koa';
import app from './server/index';
import loadConfig from './config';

const mongoose = require('mongoose');

const port = process.env.PORT || 3001;

function mongoConnect(secret: any) { // mongoDB 연결 함수
  mongoose.connect(secret.mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => { console.log('db와 연결되었습니다.'); });
}

loadConfig().then(async (res: any) => {
  await mongoConnect(res); // mongoDB 연결
  await app.listen(port); // 서버 구동
  console.info(`Listening to http://0.0.0.0:${port}`);
  exports.env = {
    accessSecretKey: res.accessSecretKey,
    // access_token 암호화 키값

    mongoAddr: res.mongoURI,
    // mongoDB 주소

    rabumsAddr: res.rabumsAddr,
    // RABUMS 주소

    rabumsToken: res.rabumsToken,
    // RABUMS 토큰
  };
});
