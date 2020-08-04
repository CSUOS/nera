import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';
import Cookie from 'koa-cookie';
import dotenv from 'dotenv';
import { getCurrentDate } from './models/meta';

const router = new Router();
const jwt = require('jsonwebtoken');
const { GroupModel } = require('./models/groupModel');

dotenv.config();
router.use(Bodyparser());
router.use(Cookie());
function getNextId() {
  return GroupModel.find({})
    .sort({ groupId: -1 })
    .limit(1).exec();
}
router.post('/', async (ctx: Koa.Context) => {
  try {
    const token = ctx.cookies.get('access_token');
    // 유저정보 쿠키 get

    const userInfo = jwt.verify(token, process.env.AccessSecretKey);
    // 토큰화된 유저 정보 decode

    const { body } = ctx.request;
    // 유저가 보낸 데이터

    if (String(userInfo.userNumber).charAt(0) !== '1') {
      ctx.throw(403, '권한 없음');
    }
    const prevGroup = await GroupModel
      .findOne({ professorNumber: userInfo.userNumber, className: body.className }).exec();
    // 이전에 작성한 답안이 있는지 탐색
    if (prevGroup === null) {
      const newGroup = new GroupModel();
      newGroup.professorNumber = userInfo.userNumber;
      newGroup.className = body.className;
      newGroup.students = body.students;
      const maxId = await GroupModel.findOne({}).sort({ groupId: -1 }).exec();
      if (maxId === null) {
        newGroup.groupId = 0;
      } else {
        newGroup.groupId = maxId.groupId + 1;
      }
      newGroup.save().then(() => console.log('수강생 목록 생성 완료'));
      ctx.body = newGroup;
    } else {
      prevGroup.students = body.students;
      prevGroup.meta.modifiedAt = getCurrentDate();
      prevGroup.save().then(() => console.log('수강생 목록 수정 완료'));
      ctx.body = prevGroup;
    }
  } catch (error) {
    ctx.body = error;
  }
});

export = router
