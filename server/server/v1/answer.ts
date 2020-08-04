import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';
import Cookie from 'koa-cookie';
import dotenv from 'dotenv';
import { getCurrentDate } from './models/meta';

const router = new Router();
const jwt = require('jsonwebtoken');
const { AnswerModel } = require('./models/answerModel');

dotenv.config();
router.use(Bodyparser());
router.use(Cookie());
router.post('/:assignmentId', async (ctx: Koa.Context) => {
  // 답안 입력, 수정
  try {
    const token = ctx.cookies.get('access_token');
    // 유저정보 쿠키 get

    const userInfo = jwt.verify(token, process.env.AccessSecretKey);
    // 토큰화된 유저 정보 decode

    const { body } = ctx.request;
    // 유저가 보낸 데이터

    if (userInfo.userNumber !== body.userNumber) { ctx.throw(403, '권한이 없습니다.'); }
    // 유저가 보낸 데이터의 학번과 쿠키에 있는 학번이 다를 경우 error
    body.answers.forEach((element: any) => {
      if (element.score !== undefined) { ctx.throw(403, '권한이 없습니다.'); }
    });
    // 유저가 보낸 데이터가 문제의 score 정보를 가지고 있을 경우 error

    const prevAnswer = await AnswerModel
      .findOne({ assignmentId: ctx.params.assignmentId, userNumber: body.userNumber }).exec();
    // 이전에 작성한 답안이 있는지 탐색

    if (prevAnswer === null) {
    // 이전에 작성한 답안이 없을 경우
      const newAnswer = new AnswerModel();
      // 새로운 답안 생성
      newAnswer.userNumber = body.userNumber;
      newAnswer.assignmentId = ctx.params.assignmentId;
      newAnswer.answers = body.answers;
      newAnswer.save().then(() => console.log('답안 생성 완료'));
      // DB에 저장
      ctx.body = newAnswer; // 확인용
    } else {
    // 이전에 작성한 답안이 있을 경우
      prevAnswer.answers = body.answers;
      // 현재의 답으로 답안 변경
      prevAnswer.meta.modifiedAt = getCurrentDate();
      // 수정 날짜 변경
      prevAnswer.save().then(() => console.log('답안 수정 완료'));
      // DB에 저장
      ctx.body = prevAnswer; // 확인용
    }
  } catch (error) {
    ctx.body = error;
  }
});
router.post('/:assignmentId/:userNumber', (ctx: Koa.Context) => {
  // 채점
});

export = router
