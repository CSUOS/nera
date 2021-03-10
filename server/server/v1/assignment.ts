import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';
import Cookie from 'koa-cookie';
import { startSession } from 'mongoose';
import assert from 'assert';
import { logger } from '../../config';
import { getCurrentDate, isNumber } from './models/meta';

const { AssignmentModel } = require('./models/assignmentModel');
const { AnswerPaperModel } = require('./models/answerPaperModel');
const { userInfo, assignmentArray } = require('../type');

const router = new Router();

router.use(Bodyparser());
router.use(Cookie());

async function calState(assignment: typeof AssignmentModel, user: typeof userInfo) {
  const now = Date.now();
  if ((now - assignment.publishingTime.getTime()) < 0) {
    return 0; // 공개전
  }
  if ((now - assignment.deadline.getTime()) < 0) {
    return 1; // 진행중
  }
  if (String(user.userNumber).charAt(0) === '1') {
    const answers = await AnswerPaperModel
      .find({ professorNumber: user.userNumber, assignmentId: assignment.assignmentId }).exec();
    if (answers === undefined) { return 2; }
    for (let j = 0; j < answers.length; j += 1) {
      for (let i = 0; i < answers[j].answers.length; i += 1) {
        if (answers[j].answers[i].score === -1) {
          return 2; // 마감됨
        }
      }
    }
    return 3;
  }

  const answer = await AnswerPaperModel
    .findOne({ userNumber: user.userNumber, assignmentId: assignment.assignmentId }).exec();

  if (answer === null) {
    return 2;
  }

  for (let i = 0; i < answer.answers.length; i += 1) {
    if (answer.answers[i].score === -1 || !answer) {
      return 2; // 마감됨
    }
  }
  return 3; // 채점완료
}

router.post('/', async (ctx: Koa.Context, next: Koa.Next) => {
  // 과제 생성 api
  const { body } = ctx.request;
  // 유저가 보낸 데이터
  if (ctx.role !== '1') { ctx.throw(403, '권한 없음'); }
  // User가 교수가 아닌 경우

  if (body.students === undefined || body.assignmentName === undefined
    || body.publishingTime === undefined || body.deadline === undefined
    || body.questions === undefined) { ctx.throw(400, '잘못된 요청'); }
  // 요청에 학생 목록, 과제이름, 발행시간, 마감기한, 문제가 없는 경우
  const session = await startSession();
  try {
    logger.info('Transaction Start');
    session.startTransaction();
    for (let i = 0; i < body.questions.length; i += 1) {
      body.questions[i].questionId = i;
      // body에서 questionId에 대한 정보가 오지 않기때문에 따로 번호를 지정해준다
      // 0부터 시작
    }
    const {
      students, assignmentName, assignmentInfo, publishingTime, deadline, questions,
    } = body;
    const newAssignment = await AssignmentModel.create([{
      professorNumber: ctx.user.userNumber,
      students,
      assignmentName,
      assignmentInfo,
      publishingTime,
      deadline,
      questions,
    }], { session });
    const { professorNumber, assignmentId } = newAssignment[0];
    const newAnswers = students.map((userNumber: number, idx: number) => ({
      userNumber,
      professorNumber,
      assignmentId,
      answers: questions.map((question: any) => ({
        questionId: question.questionId,
        answerContent: '',
      })),
    }));
    await AnswerPaperModel.create(newAnswers, { session });
    await session.commitTransaction();
    session.endSession();
    logger.info(`Transaction End ${newAssignment}`);
    ctx.body = newAssignment;
    
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error(`Transaction Error : ${err}`);
    ctx.throw(500, 'Server Error');
  }
});

router.put('/', async (ctx: Koa.Context) => {
// modify assignment
  const { body } = ctx.request;
  if (ctx.role !== '1') { ctx.throw(403, '권한 없음'); }
  if (body.students === undefined || body.assignmentName === undefined
    || body.publishingTime === undefined || body.deadline === undefined
    || body.questions === undefined || !body.assignmentId) { ctx.throw(400, '잘못된 요청'); }
  const session = await startSession();

  try {
    logger.info('Transaction Start');
    session.startTransaction();
    if (!isNumber(body.assignmentId)) { ctx.throw(400, '잘못된 요청'); }
    const prevAssignment = await AssignmentModel.findOne({
      professorNumber: ctx.user.userNumber,
      assignmentId: body.assignmentId,
    }).session(session);
    assert.ok(prevAssignment.$session());
    if (!prevAssignment) {
      ctx.throw(404, '해당 과제 없음');
    }
    prevAssignment.assignmentName = body.assignmentName;
    // 과제 이름 변경

    prevAssignment.assignmentInfo = body.assignmentInfo;
    // 과제 정보 변경

    prevAssignment.publishingTime = body.publishingTime;
    // 발행 시간 변경

    prevAssignment.deadline = body.deadline;
    // 마감 기한 변경
    for (let i = 0; i < body.questions.length; i += 1) {
      body.questions[i].questionId = i;
      // body에서 questionId에 대한 정보가 오지 않기때문에 따로 번호를 지정해준다
      // 0부터 시작
    }

    prevAssignment.questions = body.questions;
    // 문제 목록 변경

    prevAssignment.meta.modifiedAt = getCurrentDate();
    // 수정 날짜 변경

    // 0227 수정 : 학번에 따라 답안 재생성

    // 새로 추가된 학번 조회
    const newStudents = body.students.filter((student : number) => !prevAssignment.students.includes(student));
    const newAnswers = newStudents.map((userNumber: number) => ({
      userNumber,
      professorNumber: ctx.user.userNumber,
      assignmentId: body.assignmentId,
      answers: body.questions.map((question: any) => ({
        questionId: question.questionId,
        answerContent: '',
      })),
    }));
    await AnswerPaperModel.create(newAnswers, { session });
    // 삭제된 학번 조회
    const deletedStudents = prevAssignment.students.filter((student : number) => !body.students.includes(student));
    deletedStudents.forEach(async (student: number) => {
      await AnswerPaperModel.deleteOne({ userNumber: student, assignmentId: body.assignmentId }).session(session);
    })

    prevAssignment.students = body.students;
    await prevAssignment.save();
    await session.commitTransaction();
    session.endSession();
    logger.info(`Transaction End ${prevAssignment}`);
    ctx.body = prevAssignment;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error(`Transaction Error : ${err}`);
    ctx.throw(500, 'Server Error');
  }
});

router.get('/', async (ctx: Koa.Context) => {
  // 전체 과제 조회 api
  let takeAssignment: typeof assignmentArray;
  if (ctx.role === '1') {
    takeAssignment = await AssignmentModel.find({ professorNumber: ctx.user.userNumber }).exec();
    // 사용자가 교수일 경우
  } else if (ctx.role === '2') {
    takeAssignment = await AssignmentModel.find({ students: ctx.user.userNumber }).exec();
    // 사용자가 학생일 경우
  }

  if (takeAssignment === undefined) { ctx.throw(404, '과제 없음'); }

  await Promise.all(takeAssignment.map(async (element: typeof assignmentArray) => {
    const t = element;
    t.assignmentState = await calState(t, ctx.user);
    console.log(t.assignmentState);
  }));

  ctx.body = takeAssignment;
});

router.get('/:assignmentId', async (ctx: Koa.Context) => {
  let takeAssignment;
  if (!isNumber(ctx.params.assignmentId)) { ctx.throw(400, '잘못된 요청'); }
  if (ctx.role === '1') {
    takeAssignment = await AssignmentModel
      .findOne({ professorNumber: ctx.user.userNumber, assignmentId: ctx.params.assignmentId })
      .exec();
    // 사용자가 교수일 경우
  } else if (ctx.role === '2') {
    takeAssignment = await AssignmentModel
      .findOne({ students: ctx.user.userNumber, assignmentId: ctx.params.assignmentId }).exec();
    // 사용자가 학생일 경우
  }
  if (takeAssignment === null) { ctx.throw(404, '찾을 수 없음'); }
  takeAssignment.assignmentState = await calState(takeAssignment, ctx.user);
  ctx.body = takeAssignment;
});

router.delete('/:assignmentId', async (ctx: Koa.Context) => {
  // 과제 삭제
  if (!isNumber(ctx.params.assignmentId)) { ctx.throw(400, '잘못된 요청'); }
  if (ctx.role !== '1') { ctx.throw(403, '권한 없음'); }
  // User가 교수가 아닌 경우

  // 0227 추가 : assignment 삭제 시 answer paper도 모두 삭제
  const deleteAssignment = await AssignmentModel
    .findOne({ assignmentId: ctx.params.assignmentId, professorNumber: ctx.user.userNumber })
    .exec();
  deleteAssignment.students.forEach(async (student : number) => {
    await AnswerPaperModel
      .deleteOne({ assignmentId: ctx.params.assignmentId, userNumber: student });
  });
  console.log('answer paper 모두 삭제');

  await AssignmentModel
    .deleteOne({ assignmentId: ctx.params.assignmentId, professorNumber: ctx.user.userNumber });
  // group 컬렉션에서 교수 넘버, 그룹 id가 일치하는 그룹 삭제

  ctx.status = 204;
});

export = router;
