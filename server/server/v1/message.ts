import Koa from 'koa';
import Router from 'koa-router';
import Bodyparser from 'koa-bodyparser';

const router = new Router();
router.use(Bodyparser());
const fs = require('fs');

// 0228 추가
router.get('/', async (ctx: Koa.Context) => {
	const dataBuffer = fs.readFileSync('msg.json');
	if(dataBuffer === null){
		console.log("파일이 없습니다.");
		ctx.throw(404, "파일이 없습니다.");
	}

	const dataJSON = dataBuffer.toString();
	const obj: {
		message: string,
		onOff: boolean
	} = JSON.parse(dataJSON);
	
	ctx.body = obj;
})

router.post('/', async (ctx: Koa.Context) => {
	const { body } = ctx.request;
	// 유저가 보낸 데이터
	if (body === undefined && body.message === undefined && body.onOff === undefined) { ctx.throw(400, '잘못된 요청'); }

	const dataBuffer = fs.readFileSync('msg.json');
	if(dataBuffer === null){
		console.log("파일이 없습니다.");
		ctx.throw(404, "파일이 없습니다.");
	}

	const dataJSON = dataBuffer.toString();
	const obj: {
		message: string,
		onOff: boolean
	} = JSON.parse(dataJSON);

	obj.message = body.message;
	obj.onOff = body.onOff;

	const json = JSON.stringify(obj);
	fs.writeFileSync('msg.json', json);

	ctx.body = obj;
});

export = router
