import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';
import Cookie from 'koa-cookie';
import { getCurrentDate } from './models/meta';

const router = new Router();
const { GroupModel } = require('./models/groupModel');

router.use(Bodyparser());
router.use(Cookie());

router.post('/', async (ctx: Koa.Context) => {
  // 그룹 생성, 수정
  try {
    const { body } = ctx.request;
    // 유저가 보낸 데이터

    if (ctx.role !== '1') { ctx.throw(403, '권한 없음'); }
    // User가 교수가 아닌 경우

    if (body.className === undefined || body.students === undefined) { ctx.throw(400, '잘못된 요청'); }
    // 요청에 className이나 학생 목록이 없는 경우

    const prevGroup = await GroupModel
      .findOne({ professorNumber: ctx.user.userNumber, className: body.className }).exec();
    // 이전에 생성한 그룹이 있는지 탐색

    if (prevGroup === null) {
    // 이전에 생성한 그룹이 없으면

      const newGroup = new GroupModel();
      // 새로운 그룹 생성

      newGroup.professorNumber = ctx.user.userNumber;
      // 새 그룹의 교수 번호는 교수 본인의 userNumber

      newGroup.className = body.className;
      // 새 그룹의 강의 이름

      newGroup.students = body.students;
      // 새 그룹의 학생 목록

      const maxId = await GroupModel.findOne({}).sort({ groupId: -1 }).exec();
      // 가장 큰 groupId를 가진 데이터를 가져옴

      if (maxId === null) {
        newGroup.groupId = 0;
        // 데이터가 없으면 groupId를 0으로
      } else {
        newGroup.groupId = maxId.groupId + 1;
        // 데이터가 있으면 해당 groupId에 1을 더해서 groupId로 정함
      }
      await newGroup.save();
      console.log('수강생 목록 생성 완료');
      // DB에 저장
      ctx.body = newGroup; // 확인용
    } else {
      // 이전에 생성한 그룹이 있으면

      prevGroup.students = body.students;
      // 수강생 목록 변경

      prevGroup.meta.modifiedAt = getCurrentDate();
      // 수정 날짜 변경

      await prevGroup.save();
      console.log('수강생 목록 수정 완료');
      // DB에 저장

      ctx.body = prevGroup; // 확인용
    }
  } catch (error) {
    ctx.body = error;
  }
});
router.delete('/:groupId', async (ctx: Koa.Context) => {
  // 그룹 삭제
  try {
    if (ctx.role !== '1') { ctx.throw(403, '권한 없음'); }
    // User가 교수가 아닌 경우

    await GroupModel
      .deleteOne({ groupId: ctx.params.groupId, professorNumber: ctx.user.userNumber });
    // group 컬렉션에서 교수 넘버, 그룹 id가 일치하는 그룹 삭제

    ctx.status = 204;
  } catch (error) {
    ctx.body = error;
  }
});
router.get('/', async (ctx: Koa.Context) => {
  // 그룹 조회
  try {
    if (ctx.role !== '1') { ctx.throw(403, '권한 없음'); }
    // User가 교수가 아닌 경우
    const groups = await GroupModel.find({ professorNumber: ctx.user.userNumber }).exec();
    // 본인의 userNumber가 교수 번호로 들어가 있는 그룹 목록 탐색
    if (groups.length === 0) { ctx.throw(404, '찾을 수 없음'); }
    // 없을 경우 에러

    ctx.body = groups;
  } catch (error) {
    ctx.body = error;
  }
});

export = router
