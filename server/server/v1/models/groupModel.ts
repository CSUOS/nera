import Mongoose, { metaData } from './meta';

const groupSchema = new Mongoose.Schema({
  // 그룹 id
  groupId: Number,
  // 강의 이름
  className: String,
  // 교수 번호
  professorNumber: Number,
  // 학생 목록
  students: [Number],
  meta: metaData,
});
exports.GroupModel = Mongoose.model('Group', groupSchema);
