import Koa from 'koa';
import Router from 'koa-router';

const router = new Router();

const user = {
  id: '31',
  name: '고태진',
  major: '컴퓨터 과학부',
  type: 1,
  student_number: 2016920003,
};

router.get('/:id', (ctx: Koa.Context) => {
  const num = ctx.params.id;
  if (num === user.id) {
    ctx.body = user;
  } else {
    ctx.body = '일치하는 학생이 없습니다.';
  }
});

export = router
