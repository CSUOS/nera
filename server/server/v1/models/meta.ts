const Mongoose = require('mongoose');

export function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const today = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}
export const metaData = {
  // 생성 날짜
  createdAt: { type: Date, default: getCurrentDate() },
  // 수정 날짜
  modifiedAt: { type: Date, default: getCurrentDate() },
};

export default Mongoose;
