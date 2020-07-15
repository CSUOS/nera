import request from 'supertest';
import app from '../index';

test('/v1/user user서비스 동작 확인', async () => {
  const id = '31';
  if (id === '31') {
    const response = await request(app.callback()).get(`/v1/user/${id}`);
    expect(response.status).toBe(200);
    expect(response.text).toBe('{"id":"31","name":"고태진","major":"컴퓨터 과학부","type":1,"student_number":2016920003}');
  }
});
test('/v1/user user서비스 동작 확인', async () => {
  const response = await request(app.callback()).get('/v1/user/-');
  expect(response.status).toBe(200);
  expect(response.text).toBe('일치하는 학생이 없습니다.');
});
