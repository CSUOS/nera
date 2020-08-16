import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';
import Cookie from 'koa-cookie';
import { getCurrentDate, isNumber } from './models/meta';

const { AssignmentModel } = require('./models/assignmentModel');
const { AnswerPaperModel } = require('./models/answerPaperModel');

const router = new Router();

router.use(Bodyparser());
router.use(Cookie());

async function calState(assignment: any, userInfo: any) {
  const now = getCurrentDate().getTime();
  if ((now - assignment.publishingTime.getTime()) < 0) {
    return 0; // 공개전
  }
  if ((now - assignment.deadline.getTime()) < 0) {
    return 1; // 진행중
  }
  //---------
  if (String(userInfo.userNumber).charAt(0) === '1') { return 2; }
  const answer = await AnswerPaperModel
    .findOne({ userNumber: userInfo.userNumber, assignmentId: assignment.assignmentId }).exec();
  for (let i = 0; i < answer.answers.length; i += 1) {
    if (answer.answers[i].score === -1) {
      return 2; // 마감됨
    }
  }
  return 3; // 채점완료
}

router.post('/', async (ctx: Koa.Context) => {
  // 과제 생성 api
  try {
    const { body } = ctx.request;
    // 유저가 보낸 데이터

    if (ctx.role !== '1') { ctx.throw(403, '권한 없음'); }
    // User가 교수가 아닌 경우

    if (body.students === undefined || body.assignmentName === undefined
    || body.publishingTime === undefined || body.deadline === undefined
    || body.questions === undefined) { ctx.throw(400, '잘못된 요청'); }
    // 요청에 학생 목록, 과제이름, 발행시간, 마감기한, 문제가 없는 경우

    const prevAssignment = await AssignmentModel
      .findOne({ professorNumber: ctx.user.userNumber, assignmentName: body.assignmentName })
      .exec();
    // 이전에 생성한 과제가 있는지 교수 본인의 userNumber와 과제 이름으로 탐색

    if (prevAssignment === null) {
      const newAssignment = new AssignmentModel();
      // 새로운 과제 생성

      const maxId = await AssignmentModel.findOne({}).sort({ assignmentId: -1 }).exec();
      // 가장 큰 assignmentId를 가진 데이터를 가져옴

      if (maxId === null) {
      // 데이터가 없으면

        newAssignment.assignmentId = 0;
      // assignmentId를 0으로
      } else {
      // 데이터가 있으면
        newAssignment.assignmentId = maxId.assignmentId + 1;
        // 해당 assignmentId에 1을 더해서 assignmentId로 정함
      }

      newAssignment.professorNumber = ctx.user.userNumber;
      // 새로운 과제의 교수 번호는 교수 본인의 userNumber

      newAssignment.students = body.students;
      // 새로운 과제의 학생 목록

      newAssignment.assignmentName = body.assignmentName;
      // 새로운 과제의 과제 이름

      newAssignment.assignmentInfo = body.assignmentInfo;
      // 새로운 과제의 과제 정보

      newAssignment.publishingTime = body.publishingTime;
      // 새로운 과제의 발행 시간

      newAssignment.deadline = body.deadline;
      // 새로운 과제의 마감 기한

      newAssignment.questions = body.questions;
      // 새로운 과제의 문제

      await newAssignment.save().then(() => console.log('assignment create 완료'));
      // DB에 저장

      ctx.body = newAssignment; // 확인용
    } else {
    // 이전에 생성한 같은 이름의 과제가 있으면

      prevAssignment.students = body.students;
      // 학생 목록 변경

      prevAssignment.assignmentInfo = body.assignmentInfo;
      // 과제 정보 변경

      prevAssignment.publishingTime = body.publishingTime;
      // 발행 시간 변경

      prevAssignment.deadline = body.deadline;
      // 마감 기한 변경

      prevAssignment.questions = body.questions;
      // 문제 목록 변경

      prevAssignment.meta.modifiedAt = getCurrentDate();
      // 수정 날짜 변경

      await prevAssignment.save().then(() => console.log('assignment update 완료'));
      // DB에 저장

      ctx.body = prevAssignment; // 확인용
    }
  } catch (error) {
    ctx.status = error.status;
    ctx.body = error;
  }
});

router.get('/', async (ctx: Koa.Context) => {
  const token = ctx.cookies.get('access_token');
  let takeAssignment: any;
  try {
    if (ctx.role === '1') {
      takeAssignment = await AssignmentModel.find({ professorNumber: ctx.user.userNumber }).exec();
      // 사용자가 교수일 경우
    } else if (ctx.role === '2') {
      takeAssignment = await AssignmentModel.find({ students: ctx.user.userNumber }).exec();
      // 사용자가 학생일 경우
    }
    if (!takeAssignment) { ctx.throw(404, '과제 없음'); }
    await Promise.all(
      takeAssignment.map(async (element: any) => {
        const t = element;
        t.assignmentState = await calState(t, ctx.user).catch((err)=>console.log(err));
      }),
    );

    ctx.body = takeAssignment;
  } catch (error) {
    ctx.status = error.status;
    ctx.body = error;
  }
});

router.get('/:assignmentId', async (ctx: Koa.Context) => {
  let takeAssignment;
  try {
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
  } catch (error) {
    ctx.status = error.status;
    ctx.body = error;
  }
});

router.delete('/:assignmentId', async (ctx: Koa.Context) => {
  // 과제 삭제
  try {
    if (!isNumber(ctx.params.assignmentId)) { ctx.throw(400, '잘못된 요청'); }
    if (ctx.role !== '1') { ctx.throw(403, '권한 없음'); }
    // User가 교수가 아닌 경우

    await AssignmentModel
      .deleteOne({ assignmentId: ctx.params.assignmentId, professorNumber: ctx.user.userNumber });
    // group 컬렉션에서 교수 넘버, 그룹 id가 일치하는 그룹 삭제

    ctx.status = 204;
  } catch (error) {
    ctx.status = error.status;
    ctx.body = error;
  }
});

export = router;
