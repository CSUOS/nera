const Mongoose = require('mongoose');

const Answer = Mongoose.Schema;

const answerSchema = new Answer({
  // 학번
  userNumber: Number,
  // 과제 id
  assignmentId: Number,
  fullScore: Number,
  answers: [
    {
      questionId: Number,
      answerContent: String,
      score: Number,
    },
  ],
  meta: {
    createAt: Date,
    modifiedAt: Date,
  },
});

exports.AnswerModel = Mongoose.model('Answer', answerSchema);
