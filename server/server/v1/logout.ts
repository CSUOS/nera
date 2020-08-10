import Koa from 'koa';
import Router from 'koa-router';

const router = new Router();

router.post('/', (ctx: Koa.Context) => {
  ctx.cookies.set('access_token', '', { httpOnly: true, maxAge: 0 });
  ctx.status = 204;
  ctx.user = {
    _id: 0,
    userId: '',
    userName: '',
    userNumber: 0,
  };
  ctx.role = '';
});

export = router
