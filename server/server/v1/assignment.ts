import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';
import Cookie from 'koa-cookie';
import dotenv from 'dotenv';
const { AssignmentModel } = require('./models/assignmentModel');

const router = new Router();
const jwt = require('jsonwebtoken');

dotenv.config();
router.use(Bodyparser());
router.use(Cookie());

router.post('/', async (ctx: Koa.Context) => {

    try{ 
        const token = ctx.cookies.get('access_token');
        // 유저정보 쿠키 get
        const userInfo = jwt.verify(token, process.env.AccessSecretKey);
        // 토큰화된 유저 정보 decode
        const { body } = ctx.request;
        // 유저가 보낸 데이터
        if (String(userInfo.userNumber).charAt(0) !== '1') {
            ctx.throw(403, '권한 없음');
        }

        const newAssignment = new AssignmentModel();
        // 새로운 과제 생성
        const maxId = await AssignmentModel.findOne({}).sort({ assignmentId: -1 }).exec();
        if (maxId === null) {
            newAssignment.assignmentId = 0;
        } else {
            newAssignment.assignmentId = maxId.assignmentId + 1;
        }
        newAssignment.professorNumber = body.professorNumber;
        newAssignment.students = body.students;
        newAssignment.assignmentName = body.assignmentName;
        newAssignment.assignmentInfo = body.assignmentInfo;
        /*
        newAssignment.publishingTime = body.publishingTime;
        newAssignment.deadline = body.deadline;
        */
        newAssignment.questions = body.questions;
        newAssignment.save().then(() => console.log('assignment create 완료'));
        // DB에 저장
        ctx.body = newAssignment;
    } catch (error) {
        ctx.body = error;
    }
});

export = router;