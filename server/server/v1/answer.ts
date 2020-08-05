import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';
import Cookie from 'koa-cookie';
import dotenv from 'dotenv';
import { getCurrentDate } from './models/meta';

const router = new Router();
const jwt = require('jsonwebtoken');
const { AnswerPaperModel } = require('./models/answerPaperModel');
const { AssignmentModel } = require('./models/assignmentModel');

dotenv.config();
router.use(Bodyparser());
router.use(Cookie());
router.post('/:assignmentId', async (ctx: Koa.Context) => {
  // 답안 입력, 수정
  try {
    const token = ctx.cookies.get('access_token');
    // 유저정보 쿠키 get

    if (token === undefined) { ctx.throw(401, '인증 실패'); }
    // access_token이 없는 경우

    const userInfo = jwt.verify(token, process.env.AccessSecretKey);
    // 토큰화된 유저 정보 decode

    const { body } = ctx.request;
    // 유저가 보낸 데이터

    await body.answers.forEach((element: any) => {
      if (element.score !== undefined) { ctx.throw(403, '권한 없음'); }
    });
    // 유저가 보낸 데이터가 문제의 score 정보를 가지고 있을 경우 error

    if (body.professorNumber !== undefined) { ctx.throw(403, '권한 없음'); }
    // 유저가 답안의 교수 번호를 변경하려는 경우 error

    const assignment = await AssignmentModel
      .findOne({ assignmentId: ctx.params.assignmentId }).exec();
    // assignmentId로 과제 탐색

    if (assignment === null) { ctx.throw(404, '해당 과제 없음'); }
    // 과제가 없는 경우

    const prevAnswer = await AnswerPaperModel
      .findOne({ assignmentId: ctx.params.assignmentId, userNumber: userInfo.userNumber }).exec();
    // 이전에 작성한 답안이 있는지 탐색

    if (prevAnswer === null) {
    // 이전에 작성한 답안이 없을 경우

      const newAnswer = new AnswerPaperModel();
      // 새로운 답안 생성

      newAnswer.userNumber = userInfo.userNumber;
      // 새 답안의 학번

      newAnswer.professorNumber = assignment.professorNumber;
      // 새 답안의 교수 번호

      newAnswer.assignmentId = ctx.params.assignmentId;
      // 새 답안의 과제 id

      newAnswer.answers = body.answers;
      // 새 답안의 답
      // newAnswer.fullScore = assignment.fullScore;

      await newAnswer.save()
        .then(() => console.log('답안 생성 완료'));
      // DB에 저장

      ctx.body = newAnswer; // 확인용
    } else {
    // 이전에 작성한 답안이 있을 경우

      prevAnswer.answers = body.answers;
      // 현재의 답으로 답안 변경

      prevAnswer.meta.modifiedAt = getCurrentDate();
      // 수정 날짜 변경

      await prevAnswer.save().then(() => console.log('답안 수정 완료'));
      // DB에 저장

      ctx.body = prevAnswer; // 확인용
    }
  } catch (error) {
    ctx.body = error;
  }
});
router.post('/:assignmentId/:userNumber', async (ctx: Koa.Context) => {
  // 채점
  try {
    const token = ctx.cookies.get('access_token');
    // 유저정보 쿠키 get

    if (token === undefined) { ctx.throw(401, '인증 실패'); }
    // access_token이 없는 경우

    const { body } = ctx.request;
    // 유저가 보낸 데이터

    const userInfo = jwt.verify(token, process.env.AccessSecretKey);
    // 토큰화된 유저 정보 decode

    if (String(userInfo.userNumber).charAt(0) !== '1') { ctx.throw(403, '권한 없음'); }
    // User가 교수가 아닌 경우

    const studentAnswerPaper = await AnswerPaperModel
      .findOne({
        assignmentId: ctx.params.assignmentId,
        userNumber: ctx.params.userNumber,
        professorNumber: userInfo.userNumber,
      });
    // 과제 id, 학생의 userNumber, 교수 본인의 userNumber로 학생이 작성한 답안 검색

    if (studentAnswerPaper === null) { ctx.throw(404, '찾을 수 없음'); }
    // 답안이 없는 경우 error
    for (let a = 0; a < studentAnswerPaper.answers.length; a += 1) {
      const s = body.answers
        .find(async (e: any) => e.questionId === studentAnswerPaper.answers[a].questionId);
      // 유저가 보낸 데이터에서 답안의 questionId와 같은 객체를 찾음

      studentAnswerPaper.answers[a].score = s.score;
      // 답안의 점수를 그 객체의 점수로 변경
    }
    studentAnswerPaper.save().then(() => '채점 완료');
    // DB에 저장
    ctx.body = studentAnswerPaper; // 확인용
  } catch (error) {
    ctx.body = error;
  }
});
router.get('/:assignmentId', async (ctx: Koa.Context) => {
  // 답안 조회
  try {
    const token = ctx.cookies.get('access_token');
    // 유저정보 쿠키 get

    if (token === undefined) { ctx.throw(401, '인증 실패'); }
    // access_token이 없는 경우

    const userInfo = jwt.verify(token, process.env.AccessSecretKey);
    // 토큰화된 유저 정보 decode

    const answer = await AnswerPaperModel
      .findOne({ userNumber: userInfo.userNumber, assignmentId: ctx.params.assignmentId })
      .exec();
    // 쿠키의 userNumber와 매개변수로 넘어온 과제 id로 답안 조회

    if (answer.length === null) { ctx.throw(404, '찾을 수 없음'); }
    // 없을 경우 에러

    ctx.body = answer;
  } catch (error) {
    ctx.body = error;
  }
});
export = router
