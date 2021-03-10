import app from './server/index';
import { logger } from './config';

const { db } = require('./server/db');

const port = process.env.PORT || 3001;

db();
app.listen(port);
logger.info(`Listening to http://0.0.0.0:${port}`);
