import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';
import Cookie from 'koa-cookie';
import dotenv from 'dotenv';

const router = new Router();
const jwt = require('jsonwebtoken');
const { AnswerModel } = require('./models/answerModel');

const at = {
  questionId: 3,
  answerContent: 'ㅇㄹㄴㄹ',
  score: 43,
};
dotenv.config();
router.use(Bodyparser());
router.use(Cookie());
router.post('/:assignmentId', async (ctx: Koa.Context) => {
  // 답안 입력, 수정
  const test = new AnswerModel(1111, 2016920003, 1, at);
  ctx.body = test;

  try {
    const token = ctx.cookies.get('access_token');
    const userInfo = jwt.verify(token, process.env.AccessSecretKey);
    const { body } = ctx.request;

    if (userInfo.userNumber !== body.userNumber) { ctx.throw(403, '권한이 없습니다.'); }
    const query = AnswerModel
      .findOne({ assignmentId: ctx.params.assignmentId, userNumber: body.userNumber });
    const data = query.exec();

    console.log(ctx.params.assignmentId);
    if (ctx.status === 404) {
      const newAnswer = new AnswerModel();
      newAnswer.professorNumber = body.professorNumber;
      newAnswer.assignmentId = ctx.params.assignmentId;
      newAnswer.userNumber = body.userNumber;
      newAnswer.assignmentState = 0;
      newAnswer.answers = body.answers;
      newAnswer.meta.createAt = Date();
      newAnswer.meta.modifiedAt = Date();
      newAnswer.save().then(() => {
        console.log('Create 완료');
      });
      ctx.body = newAnswer;
    }
    console.log(prevAnswer);
    if (!prevAnswer) {
      console.log('여기까진 괜찮음2');
      const newAnswer = new AnswerModel();
      newAnswer.professorNumber = body.professorNumber;
      newAnswer.assignmentId = ctx.params.assignmentId;
      newAnswer.userNumber = body.userNumber;
      newAnswer.assignmentState = 0;
      newAnswer.answers = body.Answers;
      newAnswer.meta.createAt = Date();
      newAnswer.meta.modifiedAt = Date();
      ctx.body = newAnswer;
    } else {
      prevAnswer.answers = body.Answers;
      prevAnswer.metamodifiedAt = Date();
      ctx.body = prevAnswer;
    }
  } catch (error) {
    ctx.body = 'error';
  }
});
router.post('/:assignmentId/:userNumber', (ctx: Koa.Context) => {
  // 채점
});

export = router
