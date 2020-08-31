import Koa from 'koa';
import Router from 'koa-router';
import Logout from './logout';
import Answer from './answer';
import Student from './student';
import Assignment from './assignment';
import UserInfo from './userInfo';

const { jwtMiddleware } = require('../auth');

const router = new Router();

router.use(jwtMiddleware);
router.use('/answer', Answer.routes());
router.use('/student', Student.routes());
router.use('/assignment', Assignment.routes());
router.use('/logout', Logout.routes());
router.use('/userInfo', UserInfo.routes());

export = router
