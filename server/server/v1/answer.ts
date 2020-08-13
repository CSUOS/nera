import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';
import Cookie from 'koa-cookie';
import { getCurrentDate, isNumber } from './models/meta';

const router = new Router();
const { AnswerPaperModel } = require('./models/answerPaperModel');
const { AssignmentModel } = require('./models/assignmentModel');

router.use(Bodyparser());
router.use(Cookie());
router.post('/:assignmentId', async (ctx: Koa.Context) => {
  // 답안 입력, 수정
  try {
    const { body } = ctx.request;
    // 유저가 보낸 데이터

    if (body.answers === undefined) { ctx.throw(400, '잘못된 요청'); }
    // 요청에 answers 배열이 없는 경우
    if (!isNumber(ctx.params.assignmentId)) { ctx.throw(400, '잘못된 요청'); }
    body.answers.forEach((element: any) => {
      if (element.questionId === undefined || element.answerContent === undefined) { ctx.throw(400, '잘못된 요청'); }
    });
    // 답안 배열 내 원소에 문제 번호, 답안이 없을 경우

    body.answers.forEach((element: any) => {
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
      .findOne({ assignmentId: ctx.params.assignmentId, userNumber: ctx.user.userNumber }).exec();
    // 이전에 작성한 답안이 있는지 탐색

    if (prevAnswer === null) {
    // 이전에 작성한 답안이 없을 경우

      const newAnswer = new AnswerPaperModel();
      // 새로운 답안 생성

      newAnswer.userNumber = ctx.user.userNumber;
      // 새 답안의 학번

      newAnswer.professorNumber = assignment.professorNumber;
      // 새 답안의 교수 번호

      newAnswer.assignmentId = ctx.params.assignmentId;
      // 새 답안의 과제 id

      newAnswer.answers = body.answers;
      // 새 답안의 답
      // newAnswer.fullScore = assignment.fullScore;

      await newAnswer.save();
      console.log('답안 생성 완료');
      // DB에 저장

      ctx.body = newAnswer; // 확인용
    } else {
    // 이전에 작성한 답안이 있을 경우

      prevAnswer.answers = body.answers;
      // 현재의 답으로 답안 변경

      prevAnswer.meta.modifiedAt = getCurrentDate();
      // 수정 날짜 변경

      await prevAnswer.save();
      console.log('답안 수정 완료');
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
    const { body } = ctx.request;
    // 유저가 보낸 데이터
    if (body.answers === undefined) { ctx.throw(400, '잘못된 요청'); }
    // 요청에 answers 배열이 없는 경우
    if (!isNumber(ctx.params.assignmentId) || !isNumber(ctx.params.userNumber)) { ctx.throw(400, '잘못된 요청'); }
    body.answers.forEach((element: any) => {
      if (element.questionId === undefined || element.score === undefined) { ctx.throw(400, '잘못된 요청'); }
    });
    // 답안 배열 내 원소에 문제 번호, 점수가 없을 경우

    if (String(ctx.user.userNumber).charAt(0) !== '1') { ctx.throw(403, '권한 없음'); }
    // User가 교수가 아닌 경우

    const studentAnswerPaper = await AnswerPaperModel
      .findOne({
        assignmentId: ctx.params.assignmentId,
        userNumber: ctx.params.userNumber,
        professorNumber: ctx.user.userNumber,
      });
    // 과제 id, 학생의 userNumber, 교수 본인의 userNumber로 학생이 작성한 답안 검색

    if (studentAnswerPaper === null) { ctx.throw(404, '찾을 수 없음'); }
    // 답안이 없는 경우 error
    for (let a = 0; a < studentAnswerPaper.answers.length; a += 1) {
      const s = body.answers
        .find((e: any) => e.questionId === studentAnswerPaper.answers[a].questionId);
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
    if (!isNumber(ctx.params.assignmentId)) { ctx.throw(400, '잘못된 요청'); }
    const answer = await AnswerPaperModel
      .findOne({ userNumber: ctx.user.userNumber, assignmentId: ctx.params.assignmentId })
      .exec();
    // 쿠키의 userNumber와 매개변수로 넘어온 과제 id로 답안 조회

    if (answer === null) { ctx.throw(404, '찾을 수 없음'); }
    // 없을 경우 에러

    ctx.body = answer;
  } catch (error) {
    ctx.body = error;
  }
});
router.get('/:assignmentId/:userNumber', async (ctx: Koa.Context) => {
  // 학생의 답안 조회
  try {
    if (ctx.role !== '1') { ctx.throw(403, '권한 없음'); }
    // User가 교수가 아닌 경우
    if (!isNumber(ctx.params.assignmentId) || !isNumber(ctx.params.userNumber)) { ctx.throw(400, '잘못된 요청'); }
    const studentAnswerPaper = await AnswerPaperModel
      .findOne({
        assignmentId: ctx.params.assignmentId,
        userNumber: ctx.params.userNumber,
        professorNumber: ctx.user.userNumber,
      });
    // 과제 id, 학생의 userNumber, 교수 본인의 userNumber로 학생이 작성한 답안 검색

    if (studentAnswerPaper === null) { ctx.throw(404, '찾을 수 없음'); }
    // 답안이 없는 경우 error

    ctx.body = studentAnswerPaper; // 확인용
  } catch (error) {
    ctx.body = error;
  }
});
export = router
