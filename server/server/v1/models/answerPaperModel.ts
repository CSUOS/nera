import Mongoose, { metaData } from './meta';

const answerSchema = new Mongoose.Schema({
  // 문제 id
  questionId: Number,
  // 문제 내용
  answerContent: String,
  // 점수
  score: { type: Number, default: -1 },
});
const answerPaperSchema = new Mongoose.Schema({
  // 교수 번호
  professorNumber: Number,
  // 학번
  userNumber: Number,
  // 과제 id
  assignmentId: Number,
  // 배점
  // fullScore: Number,
  // 답안 배열
  answers: [answerSchema],
  meta: metaData,
});
exports.AnswerPaperModel = Mongoose.model('AnswerPaper', answerPaperSchema);
