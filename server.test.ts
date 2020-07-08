import app from './server/index';

const mockListen = jest.fn();
app.listen = mockListen;

afterEach(() => {
  mockListen.mockReset();
});

test('서버 작동함. (더미 테스트)', async () => {
  // eslint-disable-next-line global-require
  require('./server'); // only exception
  expect(mockListen.mock.calls.length).toBe(1);
  expect(mockListen.mock.calls[0][0]).toBe(process.env.PORT || 3000);
});
