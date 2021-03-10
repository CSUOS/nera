import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const axios = require('axios');
const { vaultResponse } = require('./server/type');

export const config = () =>
  /*
  const vault = `${process.env.VAULT_ADDR}/v1/csuos/nera`;
  return axios.get(vault, {
    // VAULT 서버와 통신, 환경변수로 VAULT 주소 받음
    headers: {
      'X-Vault-Token': process.env.VAULT_TOKEN,
      // 환경변수로 VAULT 토큰 값 받음
    },
  }).then((res: typeof vaultResponse) => res.data.data).catch((err: Error) => {
    console.log(err);
  }); */
  ({
    accessSecretKey: '12312412',
  });

const { combine, timestamp, printf } = winston.format;

const logFormat = printf((info) => `${info.timestamp} ${info.level}: ${info.message}`);

export const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    // info 레벨 로그를 저장할 파일 설정
    new WinstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: 'logs',
      filename: '%DATE%.log',
      maxFiles: 30, // 30일치 로그 파일 저장
      zippedArchive: true,
    }),
    // error 레벨 로그를 저장할 파일 설정
    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `logs/error`, // error.log 파일은 /logs/error 하위에 저장
      filename: '%DATE%.error.log',
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

// Production 환경이 아닌 경우(dev 등)
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(), // 색깔 넣어서 출력
      winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
    ),   
  }));
}
