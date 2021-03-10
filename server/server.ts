import app from './server/index';

const { db } = require('./server/db');

const port = process.env.PORT || 3000;

async function start_server() {
  await db();
  app.listen(port, () => {
    console.info(`Listening to http://0.0.0.0:${port}`);
  });
}

start_server();
