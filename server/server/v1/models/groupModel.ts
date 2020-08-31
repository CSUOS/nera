import Mongoose, { metaData } from './meta';

const AutoIncrement = require('mongoose-sequence')(Mongoose);

const groupSchema = new Mongoose.Schema({
  groupId: {
    type: Number,
    default: 0,
  },
  // 그룹 id
  // 강의 이름
  className: String,
  // 교수 번호
  professorNumber: Number,
  // 학생 목록
  students: [Number],
  meta: metaData,
});

groupSchema.plugin(AutoIncrement, { inc_field: 'groupId' });
exports.GroupModel = Mongoose.model('Group', groupSchema);
