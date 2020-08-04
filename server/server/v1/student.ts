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
    // 이전에 생성한 그룹이 있는지 탐색

    if (prevGroup === null) {
    // 이전에 생성한 그룹이 없으면
      const newGroup = new GroupModel();
      // 새로운 그룹 생성
      newGroup.professorNumber = userInfo.userNumber;
      newGroup.className = body.className;
      newGroup.students = body.students;
      const maxId = await GroupModel.findOne({}).sort({ groupId: -1 }).exec();
      // 가장 큰 groupId를 가진 데이터를 가져옴
      if (maxId === null) {
        newGroup.groupId = 0;
        // 데이터가 없으면 groupId를 0으로
      } else {
        newGroup.groupId = maxId.groupId + 1;
        // 데이터가 있으면 해당 groupId에 1을 더해서 groupId로 정함
      }
      newGroup.save().then(() => console.log('수강생 목록 생성 완료'));
      // DB에 저장
      ctx.body = newGroup; // 확인용
    } else {
      // 이전에 생성한 그룹이 있으면
      prevGroup.students = body.students;
      // 수강생 목록 변경
      prevGroup.meta.modifiedAt = getCurrentDate();
      // 수정 날짜 변경
      prevGroup.save().then(() => console.log('수강생 목록 수정 완료'));
      // DB에 저장
      ctx.body = prevGroup; // 확인용
    }
  } catch (error) {
    ctx.body = error;
  }
});

export = router
