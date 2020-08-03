import dotenv from 'dotenv';
import app from './server/index';
import Answers from './server/v1/entities/Answers';
import BaseEntity from './server/v1/entities/BaseEntity';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => { console.log('db와 연결되었습니다.'); });

const port = process.env.PORT || 3000;

console.info(`Listening to http://0.0.0.0:${port}`);
const server = app.listen(port);
export default server;
